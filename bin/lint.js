#! /usr/bin/env node
const path = require('path');

process.argv.push(
  '--color',
  '--config=' + path.join(__dirname, '../eslint.json5')
);

require('eslint/bin/eslint');
