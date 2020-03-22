"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@beemo/core");
const constants_1 = require("../constants");
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
const { tool } = process.beemo;
const workspacesEnabled = !!tool.package.workspaces;
const setupFilePath = core_1.Path.resolve('./tests/setup.ts');
const setupFilesAfterEnv = [];
const projects = [];
if (workspacesEnabled) {
    tool.getWorkspacePackages().forEach(({ workspace }) => {
        projects.push({
            displayName: {
                color: colors[Math.floor(Math.random() * colors.length)],
                name: workspace.packageName.toUpperCase(),
            },
            rootDir: `<rootDir>${workspace.packagePath.replace(process.cwd(), '')}`,
        });
    });
}
if (setupFilePath.exists()) {
    setupFilesAfterEnv.push(setupFilePath.path());
}
const config = {
    coverageDirectory: './coverage',
    coveragePathIgnorePatterns: [...constants_1.IGNORE_PATHS],
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
exports.default = config;
