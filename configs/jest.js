const fs = require('fs');
const path = require('path');
const { EXTS, EXT_PATTERN } = require('./constants');

module.exports = function jest(options) {
  const setupFilePath = path.join(process.cwd(), './tests/setup.js');
  const setupFiles = [];
  const projects = [];

  if (options.workspaces) {
    options.workspaces.forEach(workspace => {
      projects.push(`<rootDir>/${workspace}`);
    });
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
    moduleFileExtensions: EXTS.map(ext => ext.slice(1)), // No period
    projects,
    roots: ['./src', './tests'],
    setupFiles,
    setupTestFrameworkScriptFile: fs.existsSync(setupFilePath) ? setupFilePath : undefined,
    testMatch: [`**/?(*.)+(spec|test).${EXT_PATTERN}`],
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
      '^.+\\.tsx?$': 'ts-jest',
    },
    verbose: false,
  };
};
