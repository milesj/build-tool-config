#! /usr/bin/env node
const path = require('path');
const copy = require('copy');

console.log('Copying files to', process.cwd());

// Copy config files to the current working directory, which *should* be the project root
copy(path.join(__dirname, '../res/.*'), process.cwd(), function (error, files) {
  if (error) {
    console.error('Failed to copy files!');
  } else {
    files.forEach(function (file) {
      console.log('Copied', path.basename(file.path));
    });
  }
});
