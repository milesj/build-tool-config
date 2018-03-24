const { MIN_IE_VERSION, MIN_NODE_VERSION } = require('./constants');

module.exports = function babel(options) {
  const plugins = [
    'babel-plugin-transform-export-extensions',
    ['babel-plugin-transform-dev', { evaluate: false }],
  ];

  if (!options.node) {
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
        modules: options.esm ? false : 'commonjs',
        shippedProposals: true,
        targets: options.node ? { node: MIN_NODE_VERSION } : { ie: MIN_IE_VERSION },
        useBuiltIns: 'usage',
      },
    ],
    'babel-preset-stage-2',
    // TODO Add TypeScript
  ];

  if (options.react) {
    presets.push('babel-preset-react');
  }

  return {
    babelrc: false,
    comments: false,
    plugins,
    presets,
  };
};
