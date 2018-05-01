const fs = require('fs');
const path = require('path');
const { EXTS, EXT_PATTERN } = require('./constants');

module.exports = function jest(args, tool) {
  const setupFilePath = path.join(process.cwd(), './tests/setup.js');
  const setupFiles = [];
  const projects = [];
  const roots = [];

  if (tool.package.workspaces) {
    tool.package.workspaces.forEach(workspace => {
      projects.push(`<rootDir>/${workspace}`);
    });
  } else {
    roots.push('<rootDir>/src', '<rootDir>/tests');
  }

  if (args.react) {
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
    roots,
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
