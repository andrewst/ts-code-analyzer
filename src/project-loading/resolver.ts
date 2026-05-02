import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve, dirname, extname, relative } from 'node:path';
import ts from 'typescript';

import type { PackageExportEntry } from '../contracts/index.js';

export interface LoadedProject {
  projectRoot: string;
  tsconfigPath: string;
  compilerOptions: ts.CompilerOptions;
  fileNames: string[];
  packageExports: PackageExportEntry[];
}

export interface ProjectLoadingError {
  code: 'TARGET_NOT_FOUND' | 'TARGET_NOT_DIRECTORY' | 'TSCONFIG_NOT_FOUND' | 'TSCONFIG_INVALID';
  message: string;
  details?: string[];
}

export type ProjectLoadResult =
  | { ok: true; value: LoadedProject }
  | { ok: false; error: ProjectLoadingError };

/**
 * Resolve a repository path into a TypeScript project loading context.
 *
 * @param targetPath Repository path supplied by the caller.
 * @returns Loaded project context or a recoverable loading error.
 */
export function resolveProjectContext(targetPath: string): ProjectLoadResult {
  const resolvedTarget = resolve(targetPath);
  const targetValidationError = validateTargetDirectory(resolvedTarget);

  if (targetValidationError !== undefined) {
    return { ok: false, error: targetValidationError };
  }

  const tsconfigPath = resolve(resolvedTarget, 'tsconfig.json');
  const tsconfigValidationError = validateTsconfigPath(tsconfigPath, resolvedTarget);

  if (tsconfigValidationError !== undefined) {
    return { ok: false, error: tsconfigValidationError };
  }

  const parsedConfigResult = parseTsconfig(tsconfigPath);
  if (!parsedConfigResult.ok) {
    return parsedConfigResult;
  }

  const projectRoot = dirname(tsconfigPath);

  return {
    ok: true,
    value: {
      projectRoot,
      tsconfigPath,
      compilerOptions: parsedConfigResult.value.options,
      fileNames: parsedConfigResult.value.fileNames.map((fileName) => resolve(fileName)),
      packageExports: loadPackageExports(projectRoot, parsedConfigResult.value.fileNames),
    },
  };
}

function validateTargetDirectory(targetPath: string): ProjectLoadingError | undefined {
  if (!existsSync(targetPath)) {
    return {
      code: 'TARGET_NOT_FOUND',
      message: `Target path does not exist: ${targetPath}`,
    };
  }

  if (!statSync(targetPath).isDirectory()) {
    return {
      code: 'TARGET_NOT_DIRECTORY',
      message: `Target path is not a directory: ${targetPath}`,
    };
  }

  return undefined;
}

function validateTsconfigPath(
  tsconfigPath: string,
  targetPath: string,
): ProjectLoadingError | undefined {
  if (!existsSync(tsconfigPath)) {
    return {
      code: 'TSCONFIG_NOT_FOUND',
      message: `No tsconfig.json was found under: ${targetPath}`,
    };
  }

  return undefined;
}

function parseTsconfig(
  tsconfigPath: string,
):
  | { ok: true; value: { options: ts.CompilerOptions; fileNames: string[] } }
  | { ok: false; error: ProjectLoadingError } {
  const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
  if (configFile.error !== undefined) {
    return {
      ok: false,
      error: {
        code: 'TSCONFIG_INVALID',
        message: `Failed to read tsconfig.json: ${tsconfigPath}`,
        details: [flattenDiagnosticMessage(configFile.error.messageText)],
      },
    };
  }

  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    dirname(tsconfigPath),
    undefined,
    tsconfigPath,
  );

  if (parsedConfig.errors.length > 0) {
    return {
      ok: false,
      error: {
        code: 'TSCONFIG_INVALID',
        message: `Failed to parse tsconfig.json: ${tsconfigPath}`,
        details: parsedConfig.errors.map((error) => flattenDiagnosticMessage(error.messageText)),
      },
    };
  }

  return {
    ok: true,
    value: {
      options: parsedConfig.options,
      fileNames: parsedConfig.fileNames,
    },
  };
}

function loadPackageExports(
  projectRoot: string,
  fileNames: readonly string[],
): PackageExportEntry[] {
  const packageJsonPath = resolve(projectRoot, 'package.json');

  if (!existsSync(packageJsonPath)) {
    return [];
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as Record<string, unknown>;

  return flattenExportsField(packageJson.exports).map(([subpath, target]) => ({
    subpath,
    target,
    resolvedFile: resolveExportTarget(target, projectRoot, fileNames),
  }));
}

function flattenExportsField(exportsField: unknown): Array<[string, string]> {
  if (typeof exportsField === 'string') {
    return [['.', exportsField]];
  }

  if (!isRecord(exportsField)) {
    return [];
  }

  if (isConditionalExportsObject(exportsField)) {
    const resolvedTarget = findPreferredExportTarget(exportsField);
    return resolvedTarget === undefined ? [] : [['.', resolvedTarget]];
  }

  const entries: Array<[string, string]> = [];

  for (const [key, value] of Object.entries(exportsField)) {
    const resolved = findPreferredExportTarget(value);
    if (resolved !== undefined) {
      entries.push([key, resolved]);
    }
  }

  return entries;
}

function findPreferredExportTarget(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }

  if (!isRecord(value)) {
    return undefined;
  }

  for (const condition of EXPORT_CONDITION_PRIORITY) {
    if (!(condition in value)) {
      continue;
    }

    const nestedTarget = findPreferredExportTarget(value[condition]);
    if (nestedTarget !== undefined) {
      return nestedTarget;
    }
  }

  for (const nestedValue of Object.values(value)) {
    const nestedTarget = findPreferredExportTarget(nestedValue);
    if (nestedTarget !== undefined) {
      return nestedTarget;
    }
  }

  return undefined;
}

function isConditionalExportsObject(exportsField: Record<string, unknown>): boolean {
  const keys = Object.keys(exportsField);
  return keys.length > 0 && keys.every((key) => !key.startsWith('.'));
}

function resolveExportTarget(
  target: string,
  projectRoot: string,
  fileNames: readonly string[],
): string | undefined {
  const normalizedFiles = new Set(fileNames.map((fileName) => resolve(fileName)));

  for (const candidate of buildSourceCandidates(target, projectRoot)) {
    const resolvedCandidate = resolve(candidate);
    if (normalizedFiles.has(resolvedCandidate)) {
      return normalizeRelativePath(relative(projectRoot, resolvedCandidate));
    }
  }

  return undefined;
}

function buildSourceCandidates(target: string, projectRoot: string): string[] {
  const withoutQuery = target.split('?')[0] ?? target;
  const basePath = resolve(projectRoot, withoutQuery);
  const stem = stripKnownSourceExtension(basePath);

  const candidates = new Set<string>([
    basePath,
    `${stem}.ts`,
    `${stem}.tsx`,
    `${stem}.mts`,
    `${stem}.cts`,
    resolve(basePath, 'index.ts'),
    resolve(basePath, 'index.tsx'),
  ]);

  if (basePath.includes('/dist/') || basePath.includes('\\dist\\')) {
    const srcStem = basePath.replace(/([/\\])dist([/\\])/u, '$1src$2');
    const srcBase = stripKnownSourceExtension(srcStem);
    candidates.add(`${srcBase}.ts`);
    candidates.add(`${srcBase}.tsx`);
    candidates.add(resolve(srcBase, 'index.ts'));
  }

  return [...candidates];
}

function stripKnownSourceExtension(filePath: string): string {
  const declarationExtensions = ['.d.ts', '.d.mts', '.d.cts'];

  for (const extension of declarationExtensions) {
    if (filePath.endsWith(extension)) {
      return filePath.slice(0, -extension.length);
    }
  }

  const extension = extname(filePath);
  return extension === '' ? filePath : filePath.slice(0, -extension.length);
}

function flattenDiagnosticMessage(messageText: string | ts.DiagnosticMessageChain): string {
  return typeof messageText === 'string'
    ? messageText
    : ts.flattenDiagnosticMessageText(messageText, '\n');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeRelativePath(filePath: string): string {
  return filePath.split('\\').join('/');
}

const EXPORT_CONDITION_PRIORITY = [
  'import',
  'default',
  'node',
  'node-addons',
  'module',
  'require',
  'browser',
  'development',
  'production',
  'types',
] as const;
