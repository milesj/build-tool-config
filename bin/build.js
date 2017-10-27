#! /usr/bin/env node

const execa = require('execa');
const path = require('path');
const rimraf = require('rimraf');
const yargs = require('yargs-parser');
const run = require('./utils/run');

const args = process.argv.slice(2);
const options = yargs(args, {
  default: {
    cjs: true,
    clean: true,
    esm: true,
  },
});

function runBabel(isModule = false) {
  const source = path.join(process.cwd(), './src');
  const target = path.join(process.cwd(), isModule ? './esm' : './lib');

  // Automatically clean the target folder
  if (target && options.clean) {
    try {
      rimraf.sync(target);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  return execa('babel', [
    source,
    '--out-dir',
    target,
    options.esm ? '--modules' : '--no-modules',
    ...args,
  ]);
}

const commands = [];
const builds = [];

if (options.cjs) {
  commands.push(runBabel());
  builds.push('CJS');
}

if (options.esm) {
  commands.push(runBabel(true));
  builds.push('ESM');
}

run('babel', commands, `Transpiled ${builds.join(', ')} builds`);
