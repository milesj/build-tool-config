#! /usr/bin/env node

const execa = require('execa');
const run = require('./utils/run');

const args = process.argv.slice(2);

function runEslint() {
  return execa('eslint', [
    './{src,tests}',
    './packages/*/{src,tests}',
    '--color',
    ...args,
  ]);
}

run('eslint', runEslint(), 'Linted files');
