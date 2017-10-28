#! /usr/bin/env node

const execa = require('execa');
const run = require('./utils/run');

const args = process.argv.slice(2);

function runFlow() {
  return execa('flow', [
    'check',
    ...args,
  ]);
}

run('flow', runFlow(), 'Type checked files');
