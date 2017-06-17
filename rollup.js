/* eslint-disable no-param-reassign, comma-dangle */

import fs from 'fs';
import JSON5 from 'json5';
import path from 'path';
import babel from 'rollup-plugin-babel';
import common from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

const extensions = ['.js', '.jsx', '.json'];

// Extract the format from the command line
const format = process.argv.reduce((value, arg, index, args) => {
  if (value === true) {
    return arg;
  } else if (value === false) {
    return (arg === '-f' || arg === '--format');
  }

  return value;
}, false) || 'cjs';

// Modify Babel config a bit
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
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }),
    resolve({
      extensions,
      jsnext: true,
    }),
    common({
      extensions,
    }),
    json(),
    babel(Object.assign(babelConfig, {
      exclude: 'node_modules/**',
      runtimeHelpers: (babelConfig.plugins.indexOf('transform-runtime') >= 0),
    })),
    uglify(),
  ],
};
