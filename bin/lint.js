#! /usr/bin/env node

const yargs = require('yargs-parser');
const run = require('./utils/run');

const options = yargs(process.argv.slice(2));

const args = [
  './src',
  './tests',
  './packages/*/{src,tests}',
  '--color',
  '--report-unused-disable-directives',
];

if (options.jest) {
  args.push('--testRunner', 'jest-runner-eslint');
}

run(
  options.jest ? 'jest' : 'eslint',
  'Linted files',
  args
);
