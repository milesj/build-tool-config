import { Path } from '@beemo/core';
import { JestConfig } from '@beemo/driver-jest';
import { IGNORE_PATHS } from '../constants';
import { BeemoProcess } from '../types';

// Package: Run in root
// Workspaces: Run in root
const { tool } = (process.beemo as unknown) as BeemoProcess;
const { react } = tool.config.settings;
// @ts-ignore
const workspacesEnabled = !!tool.package.workspaces;
const setupFilePath = Path.resolve('./tests/setup.ts');
const setupFilesAfterEnv: string[] = [];
const roots: string[] = [];

if (workspacesEnabled) {
  tool.getWorkspacePaths({ relative: true }).forEach(wsPath => {
    roots.push(`<rootDir>/${wsPath.replace('/*', '')}`);
  });
} else {
  roots.push('<rootDir>');
}

if (setupFilePath.exists()) {
  setupFilesAfterEnv.push(setupFilePath.path());
}

const config: JestConfig = {
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
  setupFilesAfterEnv,
  testEnvironment: react ? 'jsdom' : 'node',
  testURL: 'http://localhost',
  timers: 'real',
  verbose: false,
};

export default config;
