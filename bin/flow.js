#! /usr/bin/env node
process.argv.push(
  '--color',
  'check'
);

require('flow-bin/cli');
