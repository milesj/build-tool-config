"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
// Package: Run in root
// Workspaces: Run in each package (using --config-file option)
const { context, tool } = process.beemo;
const { decorators = false, node = false, react = false } = tool.config.settings;
const plugins = [
    ['@babel/plugin-proposal-class-properties', { loose: decorators }],
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-catch-binding',
    '@babel/plugin-proposal-optional-chaining',
    ['babel-plugin-transform-dev', { evaluate: false }],
];
// Must be before class properties
if (decorators) {
    plugins.unshift(['@babel/plugin-proposal-decorators', { legacy: true }]);
}
// Order is important!
const presets = [
    [
        '@babel/preset-env',
        {
            loose: true,
            modules: context.args.esm ? false : 'commonjs',
            shippedProposals: true,
            targets: 
            // eslint-disable-next-line no-nested-ternary
            process.env.NODE_ENV === 'test'
                ? { node: 'current' }
                : node
                    ? { node: ((_c = (_b = (_a = tool.package) === null || _a === void 0 ? void 0 : _a.engines) === null || _b === void 0 ? void 0 : _b.node) === null || _c === void 0 ? void 0 : _c.replace('>=', '')) || constants_1.MIN_NODE_VERSION }
                    : { ie: constants_1.MIN_IE_VERSION },
        },
    ],
    '@babel/preset-typescript',
];
if (react) {
    presets.push('@babel/preset-react');
    plugins.push('babel-plugin-typescript-to-proptypes');
}
const config = {
    babelrc: false,
    comments: false,
    plugins,
    presets,
};
exports.default = config;
