#! /usr/bin/env node
/* eslint-disable no-magic-numbers, global-require */

process.argv.push('--color');

require('eslint/bin/eslint');
