// Package: Run in root
// Workspaces: Run in each package (copied into each)
module.exports = function typescript(args) {
  return {
    compilerOptions: {
      allowJs: false,
      allowSyntheticDefaultImports: true,
      declaration: true,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      lib: ['dom', 'esnext'],
      noImplicitReturns: true,
      outDir: './lib',
      pretty: true,
      removeComments: true,
      sourceMap: false,
      strict: true,
      target: 'es5',
    },
    exclude: ['*.test.ts'],
    // When --workspaces is passed, this config is copied into each package, so just local paths.
    // However, when running through Jest at the root, we need to find all within each package.
    include: [
      args.workspaces ? './src/**/*' : './packages/*/src/**/*',
      args.workspaces ? './types/**/*' : './packages/*/types/**/*',
    ],
  };
};
