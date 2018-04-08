const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

module.exports = function loadPackageWorkspaces(paths, root = process.cwd()) {
  const workspaces = paths.reduce((workspacePaths, workspacePath) => {
    const globPaths = glob.sync(path.join(root, `${workspacePath}/`), {
      absolute: true,
    });

    return [...workspacePaths, ...globPaths];
  }, []);

  return Promise.all(
    workspaces.map(workspacePath =>
      fs.readJson(path.join(workspacePath, 'package.json')).then(packageData => ({
        hasSrc: fs.existsSync(path.join(workspacePath, 'src')),
        hasTests: fs.existsSync(path.join(workspacePath, 'tests')),
        packageData,
        packageName: packageData.name,
        workspaceName: path.basename(workspacePath),
        workspacePath,
      })),
    ),
  );
};
