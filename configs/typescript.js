module.exports = function typescript() {
  return {
    compilerOptions: {
      allowJs: false,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      noImplicitReturns: true,
      outDir: './lib',
      pretty: true,
      removeComments: true,
      sourceMap: true,
      strict: true,
      target: 'es5'
    },
    include: [
      './src/**/*',
      './types/**/*'
    ],
  };
};
