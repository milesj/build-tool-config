// Package: Run in root
// Workspaces: Run in each package (each package should extend with their own config)
module.exports = function typescript(args, tool) {
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
    include: [tool.package.workspaces ? './packages/*/src/**/*' : './src/**/*', './types/**/*'],
  };
};
