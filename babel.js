module.exports = {
  comments: false,
  minified: true,
  plugins: ['transform-runtime'],
  presets: [
    ['env', {
      targets: { ie: 10 },
      useBuiltIns: true,
      debug: true,
    }],
    'stage-2',
    'react',
    'flow',
  ],
}
