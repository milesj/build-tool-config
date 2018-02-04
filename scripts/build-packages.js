const { Script } = require('@beemo/core');
const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');

module.exports = class BuildPackagesScript extends Script {
  parse() {
    return {
      string: ['main'],
    };
  }

  run(options, tool) {
    const { root } = tool.options;

    return fs
      .readdir(path.join(root, 'packages'))
      .then(files => {
        const promises = [];

        files.forEach(file => {
          promises.push(this.build(file), this.build(file, true));
        });

        return Promise.all(promises);
      })
      .then(output => {
        if (options.main) {
          fs.copySync(
            path.join(root, 'README.md'),
            path.join(root, 'packages', options.main, 'README.md'),
          );
        }

        return output;
      });
  }

  build(packageRoot, isModule = false) {
    return execa('beemo babel', [
      path.join(packageRoot, 'src'),
      '--out-dir',
      path.join(packageRoot, isModule ? 'esm' : 'lib'),
      '--copy-files',
      isModule ? '--esm' : '--cjs',
      '--silent',
    ]);
  }
};
