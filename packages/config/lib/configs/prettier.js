"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../constants");
// Package: Run in root
// Workspaces: Run in root
var config = {
    arrowParens: 'avoid',
    bracketSpacing: true,
    ignore: __spreadArrays(constants_1.IGNORE_PATHS, ['book.json', 'lerna.json', 'package.json', 'tsconfig.json', '*.d.ts']),
    jsxBracketSameLine: false,
    printWidth: 100,
    proseWrap: 'always',
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'all',
    useTabs: false,
};
exports.default = config;
