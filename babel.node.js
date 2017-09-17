module.exports = {
  babelrc: false,
  comments: false,
  plugins: [
    'transform-export-extensions',
    ['transform-dev', {
      evaluate: false,
    }],
  ],
  // Order is important!
  presets: [
    ['env', {
      targets: { node: '6.5' },
      useBuiltIns: true,
    }],
    'stage-2',
    'flow',
  ],
};
