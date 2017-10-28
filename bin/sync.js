#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const copy = require('copy');
const log = require('./utils/log');

const dest = process.cwd();

log.log('sync', 'Copying dotfiles');

// Copy dotfiles to the current working directory, which *should* be the project root
copy(path.join(__dirname, '../dotfiles/*'), dest, (error, files) => {
  if (error) {
    log.error('sync', 'Failed to copy dotfiles');

    process.exitCode = 1;

    return;
  }

  files.forEach((file) => {
    const oldName = path.basename(file.path);
    const newName = `.${oldName}`;

    // The original files are not prefixed with ".", as it causes git/npm issues
    // in this repository. So we need to rename them after they are copied.
    fs.renameSync(path.join(dest, oldName), path.join(dest, newName));

    log.success('sync', `Copied ${newName}`);
  });
});
