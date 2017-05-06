#! /usr/bin/env node
process.argv.push('--color');

require('eslint/bin/eslint');
