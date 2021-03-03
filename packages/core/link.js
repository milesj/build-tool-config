const fs = require('fs');
const path = require('path');

// Symlink specific folders from the @milesj/build-tool-config package
const links = ['src', 'templates'];

links.forEach((folder) => {
  try {
    fs.symlinkSync(
      path.join(path.dirname(require.resolve('@milesj/build-tool-config/package.json')), folder),
      path.join(__dirname, folder),
      'dir',
    );
  } catch (error) {
    // Ignore
  }
});
