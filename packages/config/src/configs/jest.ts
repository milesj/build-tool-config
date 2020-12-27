import { Path } from '@beemo/core';
import { JestConfig } from '@beemo/driver-jest';
import { IGNORE_PATHS } from '../constants';
import { BeemoProcess } from '../types';

// Package: Run in root
// Workspaces: Run in root
const { tool } = (process.beemo as unknown) as BeemoProcess;
const workspacesEnabled = !!tool.package.workspaces;
const setupFilePath = Path.resolve('./tests/setup.ts');
const setupFilesAfterEnv: string[] = [];
const projects: string[] = [];

if (workspacesEnabled) {
  tool.getWorkspacePaths({ relative: true }).forEach((wsPath) => {
    projects.push(`<rootDir>/${wsPath}`);
  });
}

if (setupFilePath.exists()) {
  setupFilesAfterEnv.push('<rootDir>/tests/setup.ts');
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
  projects,
  setupFilesAfterEnv,
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.[jt]s?(x)'],
  testURL: 'http://localhost',
  timers: 'real',
  verbose: false,
};

export default config;
