"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@beemo/core");
const constants_1 = require("../constants");
// Package: Run in root
// Workspaces: Run in root
const { context, tool } = process.beemo;
const workspacesEnabled = !!tool.package.workspaces;
const setupFilePath = core_1.Path.resolve('./tests/setup.ts');
const setupFilesAfterEnv = [];
const projects = [];
if (workspacesEnabled && context.args.useProjects) {
    tool.getWorkspacePaths({ relative: true }).forEach((wsPath) => {
        projects.push(`<rootDir>/${wsPath}`);
    });
}
if (setupFilePath.exists()) {
    setupFilesAfterEnv.push('<rootDir>/tests/setup.ts');
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
exports.default = config;
