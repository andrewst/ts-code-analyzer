import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { describe, expect, it, vi } from 'vitest';

import { runCli } from '../src/cli/index.js';

describe('runCli', () => {
  it('should render help text to stdout and exit with code 0', () => {
    const stdout: string[] = [];
    let exitCode: number | undefined;

    expect(() =>
      runCli(['--help'], {
        createAnalysisPipeline: () => {
          throw new Error('pipeline should not be created for help');
        },
        stdout: { write: (chunk: string) => void stdout.push(chunk) },
        stderr: { write: () => {} },
        exit: (code: number) => {
          exitCode = code;
          throw new Error(`exit:${code}`);
        },
        readFileSync: () => '',
      }),
    ).toThrow('exit:0');

    expect(exitCode).toBe(0);
    expect(stdout.join('')).toContain('Usage:');
  });

  it('should write error to stderr and exit with code 1 for an invalid workflow mode', () => {
    const stderr: string[] = [];
    let exitCode: number | undefined;

    expect(() =>
      runCli(['--workflow', 'unknown-mode'], {
        createAnalysisPipeline: () => {
          throw new Error('pipeline should not be created');
        },
        stdout: { write: () => {} },
        stderr: { write: (chunk: string) => void stderr.push(chunk) },
        exit: (code: number) => {
          exitCode = code;
          throw new Error(`exit:${code}`);
        },
        readFileSync: () => '',
      }),
    ).toThrow('exit:1');

    expect(exitCode).toBe(1);
    expect(stderr.join('')).toContain('Invalid workflow mode');
  });

  it('should write error to stderr and exit with code 1 when --changes value is missing', () => {
    const stderr: string[] = [];
    let exitCode: number | undefined;

    expect(() =>
      runCli(['--changes'], {
        createAnalysisPipeline: () => {
          throw new Error('pipeline should not be created');
        },
        stdout: { write: () => {} },
        stderr: { write: (chunk: string) => void stderr.push(chunk) },
        exit: (code: number) => {
          exitCode = code;
          throw new Error(`exit:${code}`);
        },
        readFileSync: () => '',
      }),
    ).toThrow('exit:1');

    expect(exitCode).toBe(1);
    expect(stderr.join('')).toContain('Missing value for --changes');
  });

  it('should write error to stderr and exit with code 1 when changes file cannot be read', () => {
    const stderr: string[] = [];
    let exitCode: number | undefined;

    expect(() =>
      runCli(['--changes', '/nonexistent/changes.txt'], {
        createAnalysisPipeline: () => {
          throw new Error('pipeline should not be created');
        },
        stdout: { write: () => {} },
        stderr: { write: (chunk: string) => void stderr.push(chunk) },
        exit: (code: number) => {
          exitCode = code;
          throw new Error(`exit:${code}`);
        },
        readFileSync: () => {
          throw new Error('ENOENT: no such file or directory');
        },
      }),
    ).toThrow('exit:1');

    expect(exitCode).toBe(1);
    expect(stderr.join('')).toContain('ENOENT');
  });

  it('should write error to stderr and exit with code 1 for an unknown argument', () => {
    const stderr: string[] = [];
    let exitCode: number | undefined;

    expect(() =>
      runCli(['--unknown-flag'], {
        createAnalysisPipeline: () => {
          throw new Error('pipeline should not be created');
        },
        stdout: { write: () => {} },
        stderr: { write: (chunk: string) => void stderr.push(chunk) },
        exit: (code: number) => {
          exitCode = code;
          throw new Error(`exit:${code}`);
        },
        readFileSync: () => '',
      }),
    ).toThrow('exit:1');

    expect(exitCode).toBe(1);
    expect(stderr.join('')).toContain('Unknown argument');
  });

  it.each([['--workflow'], ['-w']] as const)(
    'should write error to stderr and exit with code 1 when %s value is missing',
    (flag) => {
      const stderr: string[] = [];
      let exitCode: number | undefined;

      expect(() =>
        runCli([flag], {
          createAnalysisPipeline: () => {
            throw new Error('pipeline should not be created');
          },
          stdout: { write: () => {} },
          stderr: { write: (chunk: string) => void stderr.push(chunk) },
          exit: (code: number) => {
            exitCode = code;
            throw new Error(`exit:${code}`);
          },
          readFileSync: () => '',
        }),
      ).toThrow('exit:1');

      expect(exitCode).toBe(1);
      expect(stderr.join('')).toContain('Missing value for --workflow');
    },
  );

  it('should use process stderr and exit when CLI dependencies are omitted', () => {
    const stderrChunks: string[] = [];
    const stderrSpy = vi
      .spyOn(process.stderr, 'write')
      .mockImplementation((chunk: string | Uint8Array) => {
        stderrChunks.push(typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString());
        return true;
      });
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation((code?: number) => {
      throw new Error(`exit:${code ?? 0}`);
    });

    expect(() => runCli(['--not-a-real-flag'])).toThrow('exit:1');

    expect(stderrChunks.join('')).toContain('Unknown argument');

    stderrSpy.mockRestore();
    exitSpy.mockRestore();
  });

  it.each([
    ['--target', 'custom/analysis/root'],
    ['-t', 'custom/analysis/root'],
  ] as const)('should parse %s as target path alias', (flag, expectedTargetPath) => {
    const receivedRequests: unknown[] = [];
    const stdout: string[] = [];

    runCli([flag, expectedTargetPath], {
      createAnalysisPipeline: () => (request) => {
        receivedRequests.push(request);

        return {
          sections: [],
          metadata: {
            targetPath: request.targetPath,
            workflowMode: request.workflowMode,
            analysisComplete: true,
            caveats: [],
          },
        };
      },
      stdout: { write: (chunk: string) => void stdout.push(chunk) },
      stderr: { write: () => {} },
      exit: (code: number) => {
        throw new Error(`unexpected exit:${code}`);
      },
      readFileSync: () => '',
    });

    expect(receivedRequests).toEqual([
      {
        targetPath: expectedTargetPath,
        workflowMode: 'full',
        changedFiles: undefined,
      },
    ]);
    expect(stdout.join('').length).toBeGreaterThan(0);
  });

  it.each([['--target'], ['-t']] as const)(
    'should write error to stderr and exit with code 1 when %s value is missing',
    (flag) => {
      const stderr: string[] = [];
      let exitCode: number | undefined;

      expect(() =>
        runCli([flag], {
          createAnalysisPipeline: () => {
            throw new Error('pipeline should not be created');
          },
          stdout: { write: () => {} },
          stderr: { write: (chunk: string) => void stderr.push(chunk) },
          exit: (code: number) => {
            exitCode = code;
            throw new Error(`exit:${code}`);
          },
          readFileSync: () => '',
        }),
      ).toThrow('exit:1');

      expect(exitCode).toBe(1);
      expect(stderr.join('')).toContain('Missing value for --target');
    },
  );

  it('should parse workflow and changes arguments before invoking the pipeline', () => {
    const tempDirectory = mkdtempSync(join(tmpdir(), 'ts-code-analyzer-cli-'));
    const changesPath = join(tempDirectory, 'changes.txt');
    writeFileSync(changesPath, 'src/a.ts\nsrc/b.ts\n', 'utf8');

    const receivedRequests: unknown[] = [];
    const stdout: string[] = [];

    runCli(
      ['test/fixtures/library-with-exports', '--workflow', 'public-api', '--changes', changesPath],
      {
        createAnalysisPipeline: () => (request) => {
          receivedRequests.push(request);

          return {
            sections: [],
            metadata: {
              targetPath: request.targetPath,
              workflowMode: request.workflowMode,
              analysisComplete: true,
              caveats: [],
            },
          };
        },
        stdout: { write: (chunk: string) => void stdout.push(chunk) },
        stderr: { write: () => {} },
        exit: (code: number) => {
          throw new Error(`unexpected exit:${code}`);
        },
        readFileSync: (path, encoding) =>
          path === resolve(changesPath) && encoding === 'utf8' ? 'src/a.ts\nsrc/b.ts\n' : '',
      },
    );

    expect(receivedRequests).toEqual([
      {
        targetPath: 'test/fixtures/library-with-exports',
        workflowMode: 'public-api',
        changedFiles: ['src/a.ts', 'src/b.ts'],
      },
    ]);
    expect(stdout.join('')).toContain('Workflow: public-api');

    rmSync(tempDirectory, { recursive: true, force: true });
  });
});
