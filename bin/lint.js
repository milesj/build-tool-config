#! /usr/bin/env node
/* eslint-disable no-magic-numbers, global-require */
const options = require('yargs-parser')(process.argv.slice(2));

process.argv.push('--color');

if (options.parallel) {
  process.argv.push('check');

  require('esprint/build/cli');
} else {
  require('eslint/bin/eslint');
}
