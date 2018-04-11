const { Script } = require('@beemo/core');
const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const loadPackageWorkspaces = require('../utils/loadPackageWorkspaces');

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

    return loadPackageWorkspaces(tool.package.workspaces, root).then(packages =>
      Promise.all(
        packages.map(({ hasSrc, packageData, workspacePath }) => {
          if (!hasSrc) {
            return Promise.resolve();
          }

          return this.build(workspacePath, options);
        }),
      ).then(responses => {
        if (options.mainPackage) {
          fs.copySync(
            path.join(root, 'README.md'),
            path.join(root, 'packages', options.mainPackage, 'README.md'),
          );
        }

        const out = responses
          .map(response => (response ? response.stdout.trim() : ''))
          .filter(message => !!message)
          .join('\n');

        if (out) {
          tool.log(out);
        }

        return responses;
      }),
    );
  }

  build(packageRoot, options, isModule = false) {
    const args = [
      isModule ? '--esm' : '--cjs',
      '--project',
      packageRoot,
      '--outDir',
      path.join(packageRoot, 'lib'),
      '--declaration',
    ];

    if (options.react) {
      args.push('--react');
    }

    if (options.node) {
      args.push('--node');
    }

    // TEMP
    return execa('beemo', ['typescript', '--silent', ...args]);
  }
};
