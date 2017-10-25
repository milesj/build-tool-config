#! /usr/bin/env node

const execa = require('execa');
const path = require('path');
const rimraf = require('rimraf');
const options = require('yargs-parser')(process.argv.slice(2));
const exec = require('./utils/exec');

// Support --no-clean options
const clean = ('clean' in options) ? options.clean : true;

function runBabel(isModule = false) {
  const source = path.join(process.cwd(), './src');
  const target = path.join(process.cwd(), isModule ? './esm' : './lib');

  // Automatically clean the target folder
  if (target && clean) {
    try {
      rimraf.sync(target);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  return execa('babel-cli/bin/babel', [
    source,
    '--out-dir',
    target,
    '--source-type',
    isModule ? 'module' : 'script',
  ]);
}

exec('babel', [runBabel(), runBabel(true)], 'Transpiled CJS and ESM builds');
