import { relative, resolve } from 'node:path';
import ts from 'typescript';

import type {
  CompilerDiagnostic,
  ExportEdge,
  FileInfo,
  ModuleEdge,
  ModuleExportInfo,
  ProjectSnapshot,
} from '../contracts/index.js';
import type { LoadedProject } from '../project-loading/index.js';

/**
 * Build a pure project snapshot from a loaded TypeScript project context.
 *
 * @param loadedProject Resolved project loading context.
 * @returns Compiler-backed snapshot for downstream analyzers.
 */
export function buildProjectSnapshot(loadedProject: LoadedProject): ProjectSnapshot {
  const program = ts.createProgram({
    rootNames: loadedProject.fileNames,
    options: loadedProject.compilerOptions,
  });
  const checker = program.getTypeChecker();
  const normalizedFiles = new Set(loadedProject.fileNames.map((fileName) => resolve(fileName)));
  const sourceFiles = program
    .getSourceFiles()
    .filter(
      (sourceFile) =>
        !sourceFile.isDeclarationFile && normalizedFiles.has(resolve(sourceFile.fileName)),
    );

  return {
    projectRoot: loadedProject.projectRoot,
    packageExports: loadedProject.packageExports,
    fileInventory: sourceFiles.map((sourceFile) =>
      createFileInfo(sourceFile.fileName, loadedProject.projectRoot),
    ),
    moduleGraph: collectModuleGraph(
      sourceFiles,
      loadedProject.compilerOptions,
      loadedProject.projectRoot,
    ),
    exportGraph: collectExportGraph(
      sourceFiles,
      loadedProject.compilerOptions,
      loadedProject.projectRoot,
    ),
    moduleExports: collectModuleExports(sourceFiles, checker, loadedProject.projectRoot),
    diagnostics: collectDiagnostics(program, loadedProject.projectRoot),
  };
}

function collectModuleGraph(
  sourceFiles: readonly ts.SourceFile[],
  compilerOptions: ts.CompilerOptions,
  projectRoot: string,
): ModuleEdge[] {
  const moduleEdges = new Map<string, ModuleEdge>();

  for (const sourceFile of sourceFiles) {
    const from = normalizeRelativePath(relative(projectRoot, sourceFile.fileName));

    ts.forEachChild(sourceFile, (node) => {
      const moduleSpecifier =
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier !== undefined &&
        ts.isStringLiteral(node.moduleSpecifier)
          ? node.moduleSpecifier.text
          : ts.isImportEqualsDeclaration(node) &&
              ts.isExternalModuleReference(node.moduleReference) &&
              node.moduleReference.expression !== undefined &&
              ts.isStringLiteral(node.moduleReference.expression)
            ? node.moduleReference.expression.text
            : undefined;

      if (moduleSpecifier === undefined) {
        return;
      }

      const resolvedModule = ts.resolveModuleName(
        moduleSpecifier,
        sourceFile.fileName,
        compilerOptions,
        ts.sys,
      ).resolvedModule;

      if (resolvedModule === undefined || resolvedModule.isExternalLibraryImport) {
        return;
      }

      const to = normalizeRelativePath(relative(projectRoot, resolvedModule.resolvedFileName));
      const key = `${from}=>${to}`;
      moduleEdges.set(key, { from, to });
    });
  }

  return [...moduleEdges.values()];
}

function collectExportGraph(
  sourceFiles: readonly ts.SourceFile[],
  compilerOptions: ts.CompilerOptions,
  projectRoot: string,
): ExportEdge[] {
  const exportEdges = new Map<string, ExportEdge>();

  for (const sourceFile of sourceFiles) {
    const from = normalizeRelativePath(relative(projectRoot, sourceFile.fileName));

    ts.forEachChild(sourceFile, (node) => {
      if (!ts.isExportDeclaration(node)) {
        return;
      }

      const moduleSpecifier =
        node.moduleSpecifier !== undefined && ts.isStringLiteral(node.moduleSpecifier)
          ? node.moduleSpecifier.text
          : undefined;

      if (moduleSpecifier === undefined) {
        return;
      }

      const resolvedModule = ts.resolveModuleName(
        moduleSpecifier,
        sourceFile.fileName,
        compilerOptions,
        ts.sys,
      ).resolvedModule;

      if (resolvedModule === undefined || resolvedModule.isExternalLibraryImport) {
        return;
      }

      const to = normalizeRelativePath(relative(projectRoot, resolvedModule.resolvedFileName));
      const names = extractExportNames(node);
      const key = `${from}=>${to}:${names.join(',')}`;

      exportEdges.set(key, { from, to, names });
    });
  }

  return [...exportEdges.values()];
}

function collectModuleExports(
  sourceFiles: readonly ts.SourceFile[],
  checker: ts.TypeChecker,
  projectRoot: string,
): ModuleExportInfo[] {
  return sourceFiles
    .map((sourceFile) => {
      const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
      const exportedNames =
        moduleSymbol === undefined
          ? []
          : checker
              .getExportsOfModule(moduleSymbol)
              .map((symbol) => symbol.getName())
              .filter((name) => name !== 'default');

      return {
        filePath: normalizeRelativePath(relative(projectRoot, sourceFile.fileName)),
        exportedNames: [...new Set(exportedNames)].toSorted(),
      };
    })
    .toSorted((left, right) => left.filePath.localeCompare(right.filePath));
}

function collectDiagnostics(program: ts.Program, projectRoot: string): CompilerDiagnostic[] {
  return ts.getPreEmitDiagnostics(program).map((diagnostic) => ({
    code: diagnostic.code,
    message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
    file:
      diagnostic.file === undefined
        ? undefined
        : normalizeRelativePath(relative(projectRoot, diagnostic.file.fileName)),
    severity: diagnostic.category === ts.DiagnosticCategory.Error ? 'error' : 'warning',
  }));
}

function createFileInfo(fileName: string, projectRoot: string): FileInfo {
  return {
    absolutePath: resolve(fileName),
    relativePath: normalizeRelativePath(relative(projectRoot, fileName)),
  };
}

function extractExportNames(node: ts.ExportDeclaration): string[] {
  if (node.exportClause === undefined) {
    return ['*'];
  }

  if (ts.isNamedExports(node.exportClause)) {
    return node.exportClause.elements.map((element) => element.name.text);
  }

  return [node.exportClause.name.text];
}

function normalizeRelativePath(filePath: string): string {
  return filePath.split('\\').join('/');
}
