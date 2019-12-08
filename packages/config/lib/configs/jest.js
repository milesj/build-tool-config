"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@beemo/core");
var constants_1 = require("../constants");
// Package: Run in root
// Workspaces: Run in root
var tool = process.beemo.tool;
var react = tool.config.settings.react;
// @ts-ignore
var workspacesEnabled = !!tool.package.workspaces;
var setupFilePath = core_1.Path.resolve('./tests/setup.ts');
var setupFilesAfterEnv = [];
var roots = [];
if (workspacesEnabled) {
    tool.getWorkspacePaths({ relative: true }).forEach(function (wsPath) {
        roots.push("<rootDir>/" + wsPath.replace('/*', ''));
    });
}
else {
    roots.push('<rootDir>');
}
if (setupFilePath.exists()) {
    setupFilesAfterEnv.push(setupFilePath.path());
}
var config = {
    coverageDirectory: './coverage',
    coveragePathIgnorePatterns: __spreadArrays(constants_1.IGNORE_PATHS),
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
    roots: roots,
    setupFilesAfterEnv: setupFilesAfterEnv,
    testEnvironment: react ? 'jsdom' : 'node',
    testURL: 'http://localhost',
    timers: 'real',
    verbose: false,
};
exports.default = config;
