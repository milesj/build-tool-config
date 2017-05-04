#! /usr/bin/env node
const path = require('path');

process.argv.push(
  '--color',
  '--config=' + path.join(__dirname, '../eslint.json5'),
  '--ignore-path=' + path.join(__dirname, '../eslintignore')
);

require('eslint/bin/eslint');
