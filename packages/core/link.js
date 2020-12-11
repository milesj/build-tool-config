#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Symlink specific folders from the @milesj/build-tool-config package
const links = ['lib', 'templates'];

links.forEach((folder) => {
  try {
    fs.symlinkSync(
      // Resolves to lib/index.js
      path.join(require.resolve('@milesj/build-tool-config'), '../..', folder),
      path.join(__dirname, folder),
      'dir',
    );
  } catch (error) {
    // Ignore
  }
});
