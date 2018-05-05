const { MIN_IE_VERSION, MIN_NODE_VERSION } = require('./constants');

// Package: Run in root
// Workspaces: Run in each package (using --config option)
module.exports = function babel(args) {
  const plugins = [
    'babel-plugin-transform-export-extensions',
    ['babel-plugin-transform-dev', { evaluate: false }],
  ];

  if (!args.node) {
    plugins.push([
      'babel-plugin-transform-runtime',
      {
        polyfill: false,
        regenerator: true,
      },
    ]);
  }

  // Order is important!
  const presets = [
    [
      'babel-preset-env',
      {
        modules: args.esm ? false : 'commonjs',
        shippedProposals: true,
        targets: args.node ? { node: MIN_NODE_VERSION } : { ie: MIN_IE_VERSION },
        useBuiltIns: 'usage',
      },
    ],
    'babel-preset-stage-2',
    // TODO Add TypeScript
  ];

  if (args.react) {
    presets.push('babel-preset-react');
  }

  return {
    babelrc: false,
    comments: false,
    plugins,
    presets,
  };
};
