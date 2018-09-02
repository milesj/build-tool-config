const { MIN_IE_VERSION, MIN_NODE_VERSION } = require('./constants');

// Package: Run in root
// Workspaces: Run in each package (using --config-file option)
module.exports = function babel(args) {
  const plugins = [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-catch-binding',
    '@babel/plugin-proposal-optional-chaining',
    ['babel-plugin-transform-dev', { evaluate: false }],
  ];

  if (!args.node) {
    plugins.push([
      '@babel/plugin-transform-runtime',
      {
        helpers: true,
        regenerator: false,
        useESModules: !!args.esm,
      },
    ]);
  }

  // Order is important!
  const presets = [
    [
      '@babel/preset-env',
      {
        modules: args.esm ? false : 'commonjs',
        shippedProposals: true,
        targets: args.node ? { node: MIN_NODE_VERSION } : { ie: MIN_IE_VERSION },
        useBuiltIns: false,
      },
    ],
    '@babel/preset-typescript',
  ];

  if (args.react) {
    presets.push('@babel/preset-react');
    plugins.push('babel-plugin-typescript-to-proptypes');
  }

  return {
    babelrc: false,
    comments: false,
    plugins,
    presets,
  };
};
