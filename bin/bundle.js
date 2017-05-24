#! /usr/bin/env node
const path = require('path');

process.argv.push('--config', path.join(__dirname, '../rollup.js'));

require('rollup/bin/rollup');
