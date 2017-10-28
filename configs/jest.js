const path = require('path');

module.exports = {
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
  setupFiles: [
    path.join(__dirname, '../jest-setup.js'),
  ],
  setupTestFrameworkScriptFile: path.join(process.cwd(), './tests/setup.js'),
  verbose: false,
};
