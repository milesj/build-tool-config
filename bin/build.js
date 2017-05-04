#! /usr/bin/env node
const path = require('path');
const rimraf = require('rimraf');

var target;
var noClean;
var foundOutOption = false;

process.argv.forEach(function (option, index) {
  // Save our target
  if (foundOutOption) {
    target = option;
    foundOutOption = false;
  }

  // We found our target
  if (
    option === '-o' ||
    option === '-d' ||
    option === '--out-file' ||
    option === '--out-dir'
  ) {
    foundOutOption = true;
  }

  // If we dont want to clean
  if (option === '--no-clean') {
    noClean = index;
  }
})

// Remove the no-clean option before passing to babel
if (noClean) {
  process.argv.splice(noClean, 1);
}

// Automatically clean the target folder if defined
if (target && !noClean) {
  rimraf.sync(path.join(process.cwd(), target), {}, function(error) {
    if (error) {
      console.log('Failed to clean target folder', target);
    }
  });
}

require('babel-cli/bin/babel');
