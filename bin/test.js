#! /usr/bin/env node
process.env.NODE_ENV = 'test';
process.argv.push('--colors');

require('jest/bin/jest');
