#! /usr/bin/env node

const execa = require('execa');
const path = require('path');
const run = require('./utils/run');

const args = process.argv.slice(2);

function runWebpack() {
  return execa('webpack', [
    '--config',
    path.join(__dirname, '../configs/webpack.js'),
    '--color',
    ...args,
  ]);
}

run('webpack', runWebpack(), 'Bundled source files');
