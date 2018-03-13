const { Script } = require('@beemo/core');
const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');

module.exports = class BuildPackagesScript extends Script {
  parse() {
    return {
      default: {
        'main-package': 'core',
      },
      string: ['main-package'],
    };
  }

  run(options, tool) {
    const { root } = tool.options;

    return fs
      .readdir(path.join(root, 'packages'))
      .then(files => {
        const promises = [];

        files.forEach(fileName => {
          const packagePath = path.join(root, 'packages', fileName);
          const srcPath = path.join(packagePath, 'src');

          if (!fs.statSync(packagePath).isDirectory() || !fs.existsSync(srcPath)) {
            return;
          }

          promises.push(this.build(packagePath), this.build(packagePath, true));
        });

        return Promise.all(promises);
      })
      .then(responses => {
        if (options.mainPackage) {
          fs.copySync(
            path.join(root, 'README.md'),
            path.join(root, 'packages', options.mainPackage, 'README.md'),
          );
        }

        tool.log(responses.map(response => response.stdout.trim()).join('\n'));

        return responses;
      });
  }

  build(packageRoot, isModule = false) {
    return execa('beemo', [
      'babel',
      path.join(packageRoot, 'src'),
      '--out-dir',
      path.join(packageRoot, isModule ? 'esm' : 'lib'),
      '--copy-files',
      isModule ? '--esm' : '--cjs',
      '--silent',
    ]);
  }
};
