const fs = require('fs');
const path = require('path');
const { IGNORE_PATHS } = require('../constants');

// Package: Run in root
// Workspaces: Run in root
const { tool } = process.beemo;
const { react } = tool.config.settings;
const workspacesEnabled = !!tool.package.workspaces;
const setupFilePath = path.join(process.cwd(), './tests/setup.ts');
const snapshotSerializers = [];
const setupFilesAfterEnv = [];
const setupFiles = [];
const roots = [];

if (workspacesEnabled) {
  tool.getWorkspacePaths({ relative: true }).forEach(wsPath => {
    roots.push(`<rootDir>/${wsPath.replace('/*', '')}`);
  });
} else {
  roots.push('<rootDir>');
}

if (fs.existsSync(setupFilePath)) {
  setupFilesAfterEnv.push(setupFilePath);
}

module.exports = {
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: [...IGNORE_PATHS],
  coverageReporters: ['lcov'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  globals: {
    __DEV__: true,
  },
  roots,
  setupFiles,
  setupFilesAfterEnv,
  snapshotSerializers,
  testEnvironment: react ? 'jsdom' : 'node',
  testURL: 'http://localhost',
  timers: 'real',
  verbose: false,
};
