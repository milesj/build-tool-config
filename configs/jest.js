const fs = require('fs');
const path = require('path');
const { EXTS, EXT_PATTERN } = require('./constants');

// Package: Run in root
// Workspaces: Run in root
module.exports = function jest(args, tool) {
  const workspacesEnabled = !!tool.package.workspaces;
  const setupFilePath = path.join(process.cwd(), './tests/setup.ts');
  const setupFiles = [];
  const roots = [];

  if (workspacesEnabled) {
    roots.push('<rootDir>/packages');
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
    coverageThreshold: {
      global: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
      [`${workspacesEnabled ? './packages/*/' : './'}src/**/*.${EXT_PATTERN}`]: {
        branches: 80,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
    globals: {
      __DEV__: true,
      'ts-jest': {
        useBabelrc: true,
      },
    },
    moduleFileExtensions: EXTS.map(ext => ext.slice(1)), // No period
    roots,
    setupFiles,
    setupTestFrameworkScriptFile: fs.existsSync(setupFilePath) ? setupFilePath : undefined,
    snapshotSerializers: ['enzyme-to-json/serializer'],
    testMatch: [`**/?(*.)+(spec|test).${EXT_PATTERN}`],
    testURL: 'http://localhost',
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
      '^.+\\.tsx?$': 'ts-jest',
    },
    verbose: false,
  };
};
