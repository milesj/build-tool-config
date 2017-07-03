#! /usr/bin/env node
/* eslint-disable no-magic-numbers */
const path = require('path');
const rimraf = require('rimraf');
const options = require('yargs-parser')(process.argv.slice(2));

// Find the output target file or folder
const target = options.o || options.d || options.outFile || options.outDir;

// Support --no-clean options
const clean = ('clean' in options) ? options.clean : true;

// Automatically clean the target folder if defined
if (target && clean) {
  rimraf.sync(path.join(process.cwd(), target), {}, (error) => {
    if (error) {
      console.log('Failed to clean target folder', target);
    }
  });
}

require('babel-cli/bin/babel');
