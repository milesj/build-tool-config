const { MIN_IE_VERSION, MIN_NODE_VERSION } = require('../constants');

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
  '@babel/plugin-syntax-dynamic-import',
  ['babel-plugin-transform-dev', { evaluate: false }],
];

if (!node) {
  plugins.push([
    '@babel/plugin-transform-runtime',
    {
      corejs: 3,
      regenerator: process.env.NODE_ENV === 'test',
      useESModules: !!context.args.esm,
    },
  ]);
}

// Order is important!
const presets = [
  [
    '@babel/preset-env',
    {
      corejs: 3,
      loose: true,
      modules: context.args.esm ? false : 'commonjs',
      shippedProposals: true,
      targets: node ? { node: MIN_NODE_VERSION } : { ie: MIN_IE_VERSION },
      useBuiltIns: 'usage',
    },
  ],
  '@babel/preset-typescript',
];

if (react) {
  presets.push('@babel/preset-react');
  plugins.push('babel-plugin-typescript-to-proptypes');
}

module.exports = {
  babelrc: false,
  comments: false,
  plugins,
  presets,
};
