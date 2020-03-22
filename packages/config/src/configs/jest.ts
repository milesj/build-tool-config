import { Path } from '@beemo/core';
import { JestConfig, ProjectConfig } from '@beemo/driver-jest';
import { IGNORE_PATHS } from '../constants';
import { BeemoProcess } from '../types';

const colors = [
  'gray',
  'blackBright',
  'magenta',
  'magentaBright',
  'cyan',
  'cyanBright',
  'yellow',
  'yellowBright',
  'blue',
  'blueBright',
];

// Package: Run in root
// Workspaces: Run in root
const { tool } = (process.beemo as unknown) as BeemoProcess;
const workspacesEnabled = !!tool.package.workspaces;
const setupFilePath = Path.resolve('./tests/setup.ts');
const setupFilesAfterEnv: string[] = [];
const projects: ProjectConfig[] = [];

if (workspacesEnabled) {
  tool.getWorkspacePackages().forEach(({ workspace }) => {
    projects.push({
      displayName: {
        color: colors[Math.floor(Math.random() * colors.length)] as 'white',
        name: workspace.packageName.toUpperCase(),
      },
      rootDir: `<rootDir>${workspace.packagePath.replace(process.cwd(), '')}`,
    });
  });
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
  projects,
  setupFilesAfterEnv,
  testEnvironment: 'node',
  testURL: 'http://localhost',
  timers: 'real',
  verbose: false,
};

export default config;
