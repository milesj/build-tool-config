#! /usr/bin/env node
const path = require('path');

process.argv.push(
  '--color',
  '--config=' + path.join(__dirname, '../.eslintrc')
);

require('eslint/bin/eslint');
