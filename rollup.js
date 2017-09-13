/* eslint-disable no-param-reassign, comma-dangle, no-magic-numbers, dot-notation */

import fs from 'fs';
import path from 'path';
import JSON5 from 'json5';
import babel from 'rollup-plugin-babel';
import common from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import yargs from 'yargs-parser';

const options = yargs(process.argv.slice(2));
const extensions = ['.js', '.jsx', '.json'];

// Modify Babel config a bit
const babelConfig = JSON5.parse(fs.readFileSync(
  path.join(__dirname, `babel${options.node ? '.node' : ''}.json5`)
));

babelConfig.presets.forEach((preset) => {
  if (Array.isArray(preset) && preset[0] === 'env') {
    preset[1].modules = false;
  }
});

babelConfig.exclude = 'node_modules/**';
babelConfig.runtimeHelpers = (babelConfig.plugins.indexOf('transform-runtime') >= 0);

export default {
  input: './src/index.js',
  output: [
    { file: './lib/bundle.js', format: 'cjs' },
    { file: './lib/bundle.es.js', format: 'es' },
  ],
  // Order is important!
  plugins: [
    json(),
    babel(babelConfig),
    replace({
      delimiters: ['', ''],
      values: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
    }),
    resolve({ extensions }),
    common({ extensions }),
    uglify(),
  ],
  external: [
    'babel-runtime',
  ],
};
