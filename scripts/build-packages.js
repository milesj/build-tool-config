const { Script } = require('@beemo/core');
const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');

module.exports = class BuildPackagesScript extends Script {
  parse() {
    return {
      boolean: ['node', 'react'],
      default: {
        'main-package': 'core',
        node: false,
        react: false,
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

          promises.push(this.build(packagePath, options));
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

        const out = responses
          .map(response => response.stdout.trim())
          .filter(message => !!message)
          .join('\n');

        if (out) {
          tool.log(out);
        }

        return responses;
      });
  }

  build(packageRoot, options, isModule = false) {
    const args = [isModule ? '--esm' : '--cjs'];

    if (options.react) {
      args.push('--react');
    }

    if (options.node) {
      args.push('--node');
    }

    return execa('beemo', [
      'babel',
      '--silent',
      ...args,
    ]);
  }
};
