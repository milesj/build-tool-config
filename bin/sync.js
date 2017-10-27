#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const copy = require('copy');

const dest = process.cwd();

console.log('Copying files to', dest);

// Copy dotfiles to the current working directory, which *should* be the project root
copy(path.join(__dirname, '../dotfiles/*'), dest, (error, files) => {
  if (error) {
    console.error('Failed to copy files!');
  } else {
    files.forEach((file) => {
      const oldName = path.basename(file.path);
      const newName = `.${oldName}`;

      // The original files are not prefixed with ".", as it causes git/npm issues
      // in this repository. So we need to rename them after they are copied.
      fs.renameSync(path.join(dest, oldName), path.join(dest, newName));

      console.log('Copied', newName);
    });
  }
});
