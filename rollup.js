import path from 'path';
import babel from 'rollup-plugin-babel';
import common from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';

const extensions = ['.js', '.jsx', '.json'];
const format = process.argv.reduce((value, item, index, args) => {
  if (value === true) {
    return args[index + 1];
  } else if (value === false) {
    return (item === '-f' || item === '--format');
  } else {
    return value;
  }
}, false) || 'cjs';

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
    babel({
      exclude: 'node_modules/**',
      extends: path.join(__dirname, `babel${(format === 'cjs') ? '.node' : ''}.json5`),
    }),
  ],
};
