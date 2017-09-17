#! /usr/bin/env node

const path = require('path');

process.argv.push('--color');
process.argv.push('--config', path.join(__dirname, '../webpack.js'));

require('webpack/bin/webpack');
