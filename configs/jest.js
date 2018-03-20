const fs = require('fs');
const path = require('path');
const { EXTS, EXT_PATTERN } = require('./constants');

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
    coveragePathIgnorePatterns: ['/node_modules/', '/esm/', '/lib/'],
    coverageReporters: ['lcov'],
    globals: {
      __DEV__: true,
      'ts-jest': {
        useBabelrc: true,
      },
    },
    moduleFileExtensions: EXTS,
    rootDir: process.cwd(),
    roots,
    setupFiles,
    setupTestFrameworkScriptFile: fs.existsSync(setupFilePath) ? setupFilePath : null,
    testMatch: [`**/?(*.)+(spec|test).${EXT_PATTERN}`],
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
      '^.+\\.tsx?$': 'ts-jest',
    },
    verbose: false,
  };
};
