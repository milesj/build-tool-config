#! /usr/bin/env node

const execa = require('execa');
const path = require('path');
const rimraf = require('rimraf');
const yargs = require('yargs-parser');
const exec = require('./utils/exec');

const options = yargs(process.argv.slice(2), {
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

  return execa('babel-cli/bin/babel', [
    source,
    '--out-dir',
    target,
    '--source-type',
    isModule ? 'module' : 'script',
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

exec('babel', commands, `Transpiled ${builds.join(', ')} builds`);
