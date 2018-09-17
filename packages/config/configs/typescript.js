// Package: Run in root
// Workspaces: Run in each package (copied into each)
module.exports = function typescript(args, tool) {
  const { node, react } = tool.config.settings;
  const compilerOptions = {
    allowJs: false,
    allowSyntheticDefaultImports: true,
    declaration: true,
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    lib: ['dom', 'esnext'],
    module: 'commonjs',
    noEmitOnError: true,
    noImplicitReturns: true,
    outDir: './lib',
    pretty: true,
    removeComments: false,
    sourceMap: false,
    strict: true,
    target: node ? 'es2017' : 'es5',
  };

  if (react) {
    compilerOptions.jsx = 'react';
  }

  let include = ['./src/**/*', './types/**/*'];

  // When --noEmit is passed, we want to run the type checker and include test files.
  // Otherwise, we do not want to emit declarations for test files.
  if (args.noEmit) {
    include.push('./tests/**/*');
  }

  // When --workspaces is passed, this config is copied into each package, so use local paths.
  // However, when running through Jest at the root, we need to find all packages.
  // Be sure not to breat non-workspace enabled projects.
  if (!args.workspaces && tool.package.workspaces) {
    include = include.map(path => `./packages/*${path.slice(1)}`);
  }

  return {
    compilerOptions,
    include,
  };
};
