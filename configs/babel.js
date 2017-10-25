const yargs = require('yargs-parser');

const options = yargs(process.argv.slice(2), {
  default: {},
});

console.log(process, options);

// Setup plugins
const plugins = [
  'transform-export-extensions',
  ['transform-dev', { evaluate: false }],
];

if (!options.node) {
  plugins.push('transform-runtime');
}

// Setup presets (order is important)
const presets = [
  ['env', {
    debug: options.debug || false,
    modules: options.esm ? false : 'commonjs',
    shippedProposals: true,
    targets: options.node ? { node: '6.5' } : { ie: '10' },
    useBuiltIns: 'usage',
  }],
  'stage-2',
  'flow',
];

if (options.react) {
  presets.push('react');
}

module.exports = {
  babelrc: false,
  comments: false,
  plugins,
  presets,
};
