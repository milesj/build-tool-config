#! /usr/bin/env node
process.argv.push('--coverage');

require('./test');
