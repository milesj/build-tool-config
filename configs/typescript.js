// Package: Run in root
// Workspaces: Run in each package (copied into each)
module.exports = function typescript(args, tool) {
  // When --workspaces is passed, this config is copied into each package, so use local paths.
  // However, when running through Jest at the root, we need to find all packages.
  // Be sure not to breat non-workspace enabled projects.
  const isWorkspaceRoot = !args.workspaces && !!tool.package.workspaces;
  const compilerOptions = {
    allowJs: false,
    allowSyntheticDefaultImports: true,
    declaration: true,
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    lib: ['dom', 'esnext'],
    noImplicitReturns: true,
    outDir: './lib',
    pretty: true,
    removeComments: false,
    sourceMap: false,
    strict: true,
    target: 'es5',
  };

  if (args.react) {
    compilerOptions.jsx = 'react';
  }

  return {
    compilerOptions,
    include: isWorkspaceRoot
      ? ['./packages/*/src/**/*', './packages/*/tests/**/*', './packages/*/types/**/*']
      : ['./src/**/*', './tests/**/*', './types/**/*'],
  };
};
