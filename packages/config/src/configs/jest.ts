import { Path } from '@beemo/core';
import { JestConfig } from '@beemo/driver-jest';
import { IGNORE_PATHS } from '../constants';
import { BeemoProcess } from '../types';

interface Args {
  useProjects?: boolean;
}

// Package: Run in root
// Workspaces: Run in root
const { context, tool } = (process.beemo as unknown) as BeemoProcess<Args>;
const workspacesEnabled = !!tool.package.workspaces;
const setupFilePath = Path.resolve('./tests/setup.ts');
const setupFilesAfterEnv: string[] = [];
const projects: string[] = [];

if (workspacesEnabled && context.args.useProjects) {
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
  setupFilesAfterEnv,
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.[jt]s?(x)'],
  testURL: 'http://localhost',
  timers: 'real',
  verbose: false,
};

if (projects.length > 0) {
  config.projects = projects;
}

export default config;
