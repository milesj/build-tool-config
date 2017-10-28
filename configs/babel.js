const options = require('yargs-parser')(process.argv.slice(2), {
  default: {
    modules: false,
    node: false,
    react: (process.env.BUILD_CURRENT_RUN === 'jest'),
  },
});

// Setup plugins
const plugins = [
  require.resolve('babel-plugin-transform-export-extensions'),
  [require.resolve('babel-plugin-transform-dev'), { evaluate: false }],
];

if (!options.node) {
  plugins.push([require.resolve('babel-plugin-transform-runtime'), {
    polyfill: false,
    regenerator: false,
  }]);
}

// Setup presets (order is important)
const presets = [
  [require.resolve('babel-preset-env'), {
    modules: options.modules ? false : 'commonjs',
    shippedProposals: true,
    targets: options.node ? { node: '6.5' } : { ie: '10' },
    useBuiltIns: 'usage',
  }],
  require.resolve('babel-preset-stage-2'),
  require.resolve('babel-preset-flow'),
];

if (options.react) {
  presets.push(require.resolve('babel-preset-react'));
}

module.exports = {
  babelrc: false,
  comments: false,
  plugins,
  presets,
};
