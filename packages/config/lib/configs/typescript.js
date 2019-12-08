"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
// Package: Run in root
// Workspaces: Run in each package (copied into each)
var _a = process.beemo, context = _a.context, tool = _a.tool;
var _b = tool.config.settings, node = _b.node, react = _b.react;
var compilerOptions = {
    allowJs: false,
    allowSyntheticDefaultImports: true,
    declaration: true,
    esModuleInterop: true,
    experimentalDecorators: !!context.args.decorators || false,
    forceConsistentCasingInFileNames: true,
    lib: ['dom', 'esnext'],
    module: 'commonjs',
    noEmitOnError: true,
    noImplicitReturns: true,
    pretty: true,
    removeComments: false,
    sourceMap: !!context.args.sourceMaps || false,
    strict: true,
    target: node ? 'es2018' : 'es5',
    useDefineForClassFields: process.env.NODE_ENV === 'development',
};
var include = [];
if (react) {
    compilerOptions.jsx = 'react';
}
if (!context.args.referenceWorkspaces) {
    include.push('./src/**/*', './types/**/*');
    // When --noEmit is passed, we want to run the type checker and include test files.
    // Otherwise, we do not want to emit declarations for test files.
    if (context.args.noEmit) {
        include.push('./tests/**/*');
    }
    compilerOptions.outDir = "./" + constants_1.CJS_FOLDER;
}
var config = {
    compilerOptions: compilerOptions,
    include: include,
};
exports.default = config;
