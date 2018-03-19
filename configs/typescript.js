module.exports = function typescript(options) {
  return {
    compilerOptions: {
      allowJs: false,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      lib: ['esnext'],
      noImplicitReturns: true,
      outDir: './lib',
      pretty: true,
      removeComments: true,
      sourceMap: false,
      strict: true,
      target: 'es5',
    },
    exclude: ['*.test.ts'],
    include: [options.workspaces ? './packages/*/src/**/*' : './src/**/*', './types/**/*'],
  };
};
