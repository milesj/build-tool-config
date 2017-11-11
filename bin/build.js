#! /usr/bin/env node

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

function buildBabelCommand(isModule = false) {
  const source = path.join(process.cwd(), './src');
  const target = path.join(process.cwd(), isModule ? './esm' : './lib');

  // Automatically clean the target folder
  if (target && options.clean) {
    rimraf.sync(target);
  }

  return [
    source,
    '--out-dir',
    target,
    isModule ? '--modules' : '--no-modules',
  ];
}

const commands = [];
const builds = [];

if (options.cjs) {
  commands.push(buildBabelCommand());
  builds.push('CJS');
}

if (options.esm) {
  commands.push(buildBabelCommand(true));
  builds.push('ESM');
}

run(
  'babel',
  `Transpiled ${builds.join(', ')} builds`,
  ...commands
);
