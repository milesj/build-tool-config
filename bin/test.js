#! /usr/bin/env node
const path = require('path');

process.argv.push(
  '--colors',
  '--config=' + path.join(__dirname, '../jest.json')
);

require('jest/bin/jest');
