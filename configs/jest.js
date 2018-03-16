const fs = require('fs');
const path = require('path');

const setupFilePath = path.join(process.cwd(), './tests/setup.js');

module.exports = function jest(options) {
  const setupFiles = [];
  const roots = [];

  if (options.workspaces) {
    roots.push('./packages');
  } else {
    roots.push('./src', './tests');
  }

  if (options.react) {
    setupFiles.push(path.join(__dirname, './jest/enzyme.js'));
  }

  return {
    coverageDirectory: './coverage',
    coveragePathIgnorePatterns: ['/node_modules/', '/lib/', '/esm/'],
    coverageReporters: ['lcov'],
    globals: {
      __DEV__: true,
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    rootDir: process.cwd(),
    roots,
    setupFiles,
    setupTestFrameworkScriptFile: fs.existsSync(setupFilePath) ? setupFilePath : null,
    testMatch: ['**/?(*.)(spec|test).(t|j)s?(x)'],
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
      '^.+\\.tsx?$': path.join(__dirname, './jest/tsProcessor.js'),
    },
    verbose: false,
  };
};
