#! /usr/bin/env node

const path = require('path');
const run = require('./utils/run');

run(
  'jest',
  'Tested files',
  [
    '--config',
    path.join(__dirname, '../configs/jest.js'),
    '--colors',
    '--logHeapUsage',
  ],
);
