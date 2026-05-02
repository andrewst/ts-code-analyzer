import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { createAnalysisPipeline, type AnalysisPipelineDependencies } from '../application/index.js';
import type { AnalysisRequest, WorkflowMode } from '../contracts/index.js';
import { formatAnalysisReport } from '../presentation/index.js';

export interface CliDependencies {
  createAnalysisPipeline: (
    dependencies?: AnalysisPipelineDependencies,
  ) => (request: AnalysisRequest) => ReturnType<ReturnType<typeof createAnalysisPipeline>>;
  stdout: { write: (chunk: string) => void };
  stderr: { write: (chunk: string) => void };
  exit: (code: number) => never;
  readFileSync: (path: string, encoding: BufferEncoding) => string;
}

/**
 * Run the CLI entry point using process-like dependencies.
 *
 * @param argv Raw CLI arguments excluding the node executable and script path.
 * @param dependencies CLI dependencies for I/O and application orchestration.
 */
export function runCli(argv: readonly string[], dependencies?: CliDependencies): void {
  const resolvedDependencies = dependencies ?? {
    createAnalysisPipeline,
    stdout: process.stdout,
    stderr: process.stderr,
    exit: (code: number) => process.exit(code),
    readFileSync,
  };

  const parsedArguments = parseCliArguments(argv, resolvedDependencies.readFileSync);

  if (!parsedArguments.ok) {
    const output =
      parsedArguments.message === HELP_TEXT ? HELP_TEXT : `${parsedArguments.message}\n`;
    const stream =
      parsedArguments.message === HELP_TEXT
        ? resolvedDependencies.stdout
        : resolvedDependencies.stderr;
    stream.write(output);
    return resolvedDependencies.exit(parsedArguments.exitCode);
  }

  const pipeline = resolvedDependencies.createAnalysisPipeline();
  const report = pipeline(parsedArguments.request);
  const output = formatAnalysisReport(report);

  resolvedDependencies.stdout.write(output);
}

function parseCliArguments(
  argv: readonly string[],
  readTextFile: (path: string, encoding: BufferEncoding) => string,
): { ok: true; request: AnalysisRequest } | { ok: false; message: string; exitCode: number } {
  let targetPath = '.';
  let workflowMode: WorkflowMode = 'full';
  let changedFiles: string[] | undefined;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === '--help' || argument === '-h') {
      return { ok: false, message: HELP_TEXT, exitCode: 0 };
    }

    if (argument === '--target' || argument === '-t') {
      const value = argv[index + 1];
      if (value === undefined) {
        return { ok: false, message: 'Missing value for --target', exitCode: 1 };
      }

      targetPath = value;
      index += 1;
      continue;
    }

    if (argument === '--workflow' || argument === '-w') {
      const value = argv[index + 1];
      if (value === undefined) {
        return { ok: false, message: 'Missing value for --workflow', exitCode: 1 };
      }

      if (!isWorkflowMode(value)) {
        return {
          ok: false,
          message: `Invalid workflow mode: ${value}. Expected one of: full, public-api, structure`,
          exitCode: 1,
        };
      }

      workflowMode = value;
      index += 1;
      continue;
    }

    if (argument === '--changes' || argument === '-c') {
      const value = argv[index + 1];
      if (value === undefined) {
        return { ok: false, message: 'Missing value for --changes', exitCode: 1 };
      }

      try {
        changedFiles = readChangedFiles(value, readTextFile);
      } catch (error) {
        return {
          ok: false,
          message: error instanceof Error ? error.message : 'Failed to read changes file',
          exitCode: 1,
        };
      }

      index += 1;
      continue;
    }

    if (!argument.startsWith('-') && targetPath === '.') {
      targetPath = argument;
      continue;
    }

    return { ok: false, message: `Unknown argument: ${argument}`, exitCode: 1 };
  }

  return {
    ok: true,
    request: {
      targetPath,
      workflowMode,
      changedFiles,
    },
  };
}

function readChangedFiles(
  inputPath: string,
  readTextFile: (path: string, encoding: BufferEncoding) => string,
): string[] {
  const resolvedPath = resolve(inputPath);
  const fileContents = readTextFile(resolvedPath, 'utf8');

  return fileContents
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function isWorkflowMode(value: string): value is WorkflowMode {
  return value === 'full' || value === 'public-api' || value === 'structure';
}

const HELP_TEXT = `ts-code-analyzer

Usage:
  ts-code-analyzer [target-path] [--workflow <mode>] [--changes <path>]

Options:
  -t, --target <path>       Repository path to analyze
  -w, --workflow <mode>     Workflow mode: full, public-api, structure
  -c, --changes <path>      Path to a newline-delimited changed-files list
  -h, --help                Show this help text
`;
