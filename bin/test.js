#! /usr/bin/env node

const execa = require('execa');
const path = require('path');
const run = require('./utils/run');

const args = process.argv.slice(2);

function runJest() {
  process.env.NODE_ENV = 'test';

  return execa('jest', [
    '--config',
    path.join(__dirname, '../configs/jest.js'),
    '--colors',
    '--logHeapUsage',
    ...args,
  ]);
}

run('jest', runJest(), 'Tested files');
