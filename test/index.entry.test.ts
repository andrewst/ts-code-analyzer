import { afterEach, describe, expect, it, vi } from 'vitest';

const runCliMock = vi.fn();

vi.mock('../src/cli/index.js', () => ({
  runCli: runCliMock,
}));

describe('CLI entry', () => {
  const originalArgv = process.argv;

  afterEach(() => {
    process.argv = [...originalArgv];
    vi.resetModules();
    runCliMock.mockClear();
  });

  it('should pass sliced process.argv to runCli', async () => {
    process.argv = ['node', '/app/dist/index.js', 'my-target', '-w', 'structure'];
    vi.resetModules();
    await import('../src/index.js');

    expect(runCliMock).toHaveBeenCalledTimes(1);
    expect(runCliMock).toHaveBeenCalledWith(['my-target', '-w', 'structure']);
  });
});
