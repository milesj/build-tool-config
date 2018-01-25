const path = require('path');

module.exports = function jest(options) {
  const setupFiles = [];

  if (options.enzyme) {
    setupFiles.push(path.join(__dirname, './jest/enzyme.js'));
  }

  return {
    coverageDirectory: './coverage',
    coverageReporters: ['lcov'],
    globals: {
      __DEV__: true,
    },
    rootDir: process.cwd(),
    roots: [
      './src',
      './tests',
      './packages',
    ],
    setupFiles,
    // TODO make optional
    setupTestFrameworkScriptFile: path.join(process.cwd(), './tests/setup.js'),
    verbose: false,
  };
};
