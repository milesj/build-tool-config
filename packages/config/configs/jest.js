const fs = require('fs');
const path = require('path');
const { EXTS, EXT_PATTERN, IGNORE_PATHS } = require('./constants');

// Package: Run in root
// Workspaces: Run in root
const { tool } = process.beemo;
const { react } = tool.config.settings;
const workspacesEnabled = !!tool.package.workspaces;
const setupFilePath = path.join(process.cwd(), './tests/setup.ts');
const snapshotSerializers = [];
const setupFiles = [];
const roots = [];

if (workspacesEnabled) {
  roots.push('<rootDir>/packages');
} else {
  roots.push('<rootDir>');
}

if (react) {
  setupFiles.push(path.join(__dirname, './jest/enzyme.js'));
  snapshotSerializers.push('enzyme-to-json/serializer');
}

module.exports = {
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: [...IGNORE_PATHS],
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
  },
  moduleFileExtensions: EXTS.map(ext => ext.slice(1)), // No period
  roots,
  setupFiles,
  setupTestFrameworkScriptFile: fs.existsSync(setupFilePath) ? setupFilePath : undefined,
  snapshotSerializers,
  testMatch: [`**/?(*.)+(spec|test).${EXT_PATTERN}`],
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
  },
  verbose: false,
};
