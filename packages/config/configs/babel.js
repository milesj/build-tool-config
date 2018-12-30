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
  ['babel-plugin-transform-dev', { evaluate: false }],
];

if (!node) {
  plugins.push([
    '@babel/plugin-transform-runtime',
    {
      helpers: true,
      regenerator: false,
      useESModules: !!context.args.esm,
    },
  ]);
}

// Order is important!
const presets = [
  [
    '@babel/preset-env',
    {
      modules: context.args.esm ? false : 'commonjs',
      shippedProposals: true,
      targets: node ? { node: MIN_NODE_VERSION } : { ie: MIN_IE_VERSION },
      useBuiltIns: false,
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
