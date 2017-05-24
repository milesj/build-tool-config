import fs from 'fs';
import JSON5 from 'json5';
import path from 'path';
import babel from 'rollup-plugin-babel';
import common from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';

const extensions = ['.js', '.jsx', '.json'];

// Extract the format from the command line
const format = process.argv.reduce((value, item, index, args) => {
  if (value === true) {
    return args[index + 1];
  } else if (value === false) {
    return (item === '-f' || item === '--format');
  } else {
    return value;
  }
}, false) || 'cjs';

// Disable Babel modules
const babelConfig = JSON5.parse(fs.readFileSync(
  path.join(__dirname, `babel${(format === 'cjs') ? '.node' : ''}.json5`)
));

babelConfig.presets.forEach((preset) => {
  if (Array.isArray(preset) && preset[0] === 'env') {
    preset[1].modules = false;
  }
});

export default {
  format,
  entry: './src/index.js',
  dest: './lib/bundle.js',
  sourceMap: (format === 'iife'),
  // Order is important!
  plugins: [
    resolve({
      jsnext: true,
      extensions,
    }),
    common({
      extensions,
    }),
    json(),
    babel(babelConfig),
  ],
};
