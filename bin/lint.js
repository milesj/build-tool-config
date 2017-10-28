#! /usr/bin/env node

const run = require('./utils/run');

run(
  'eslint',
  'Linted files',
  [
    './src',
    './tests',
    './packages/*/{src,tests}',
    '--color',
    '--report-unused-disable-directives',
  ],
);
