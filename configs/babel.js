module.exports = function babel(options) {
  // Setup plugins
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

  // Setup presets (order is important)
  const presets = [
    [
      'babel-preset-env',
      {
        modules: options.esm ? false : 'commonjs',
        shippedProposals: true,
        targets: options.node ? { node: '6.5' } : { ie: '10' },
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
