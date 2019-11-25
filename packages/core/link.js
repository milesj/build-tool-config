#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Symlink specific folders from the @milesj/build-tool-config package
const links = ['configs', 'scripts', 'templates'];

links.forEach(folder => {
  fs.symlinkSync(
    path.join(__dirname, '../build-tool-config', folder),
    path.join(__dirname, folder),
    'dir',
  );
});
