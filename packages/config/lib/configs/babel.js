"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
// Package: Run in root
// Workspaces: Run in each package (using --config-file option)
const { context, tool } = process.beemo;
const { node, react } = tool.config.settings;
const plugins = [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-catch-binding',
    '@babel/plugin-proposal-optional-chaining',
    ['babel-plugin-transform-dev', { evaluate: false }],
];
// Order is important!
const presets = [
    [
        '@babel/preset-env',
        {
            loose: true,
            modules: context.args.esm ? false : 'commonjs',
            shippedProposals: true,
            targets: node ? { node: constants_1.MIN_NODE_VERSION } : { ie: constants_1.MIN_IE_VERSION },
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
