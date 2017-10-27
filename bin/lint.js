#! /usr/bin/env node

const execa = require('execa');
const run = require('./utils/run');

const args = process.argv.slice(2);

function runESLint() {
  return execa('eslint', [
    './src',
    './tests',
    './packages/*/{src,tests}',
    '--color',
    '--report-unused-disable-directives',
    ...args,
  ]);
}

run('eslint', runESLint(), 'Linted files');
