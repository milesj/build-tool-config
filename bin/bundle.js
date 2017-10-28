#! /usr/bin/env node

const path = require('path');
const run = require('./utils/run');

run(
  'webpack',
  'Bundled source files',
  [
    '--config',
    path.join(__dirname, '../configs/webpack.js'),
    '--color',
  ],
);
