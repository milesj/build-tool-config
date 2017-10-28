const path = require('path');

module.exports = {
  coverageDirectory: './coverage',
  coverageReporters: ['lcov'],
  globals: {
    __DEV__: true,
  },
  roots: [
    './src',
    './tests',
    './packages',
  ],
  setupFiles: [
    path.join(__dirname, '../jest-setup.js'),
  ],
  setupTestFrameworkScriptFile: './tests/setup.js',
  verbose: false,
};
