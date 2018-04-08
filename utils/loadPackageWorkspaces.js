const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

module.exports = function loadPackageWorkspaces(paths, root = process.cwd()) {
  const folderPaths = paths.map(dir => (dir.slice(-1) === '/' ? dir : `${dir}/`));
  const workspaces = glob.sync(path.join(root, `{${folderPaths.join(',')}}`), {
    absolute: true,
  });

  return Promise.all(
    workspaces.map(workspacePath =>
      fs.readJson(path.join(workspacePath, 'package.json')).then(packageData => ({
        hasSrc: fs.existsSync(path.join(workspacePath, 'src')),
        hasTests: fs.existsSync(path.join(workspacePath, 'tests')),
        packageData,
        packageName: path.basename(workspacePath),
        workspacePath,
      })),
    ),
  );
};
