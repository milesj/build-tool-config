/* eslint-disable sort-keys */

const { Script } = require('@beemo/core');
const fs = require('fs-extra');
const path = require('path');

module.exports = class InitScript extends Script {
  parse() {
    return {
      boolean: ['docs', 'local', 'workspaces'],
    };
  }

  run(options, tool) {
    const packageConfig = { ...tool.package };

    // Bemo
    Object.assign(packageConfig.beemo, {
      module: options.local ? '@local' : '@milesj/build-tool-config',
      drivers: ['babel', 'eslint', 'jest', 'prettier', 'typescript'],
    });

    // Scripts
    Object.assign(packageConfig.scripts, {
      coverage: 'yarn run jest --coverage',
      eslint: 'beemo eslint',
      jest: 'beemo jest',
      prettier: 'beemo prettier',
      type: 'beemo typescript',

      // Hooks
      pretest: 'yarn run type --silent',
      test: 'yarn run jest --silent',
      posttest: 'yarn run eslint --silent',
    });

    if (options.docs) {
      Object.assign(packageConfig.scripts, {
        docs: 'gitbook build --log=debug --debug',
        'docs:serve': 'gitbook serve',
        'docs:install': 'gitbook install',
      });
    }

    if (options.workspaces) {
      if (!packageConfig.devDependencies.lerna) {
        throw new Error(`Lerna must be installed to use workspaces.`);
      }

      if (!packageConfig.name.endsWith('-root')) {
        packageConfig.name += '-root';
      }

      packageConfig.private = true;
      packageConfig.workspaces = ['packages/*'];

      Object.assign(packageConfig.scripts, {
        bootstrap: 'lerna bootstrap',
        'bootstrap:slow': 'yarn run bootstrap --concurrency=1',
        build: 'beemo run-script build-packages',
        clean: 'rimraf ./packages/*/{lib,esm}/ && lerna clean --yes',
        package: 'yarn run clean && yarn run bootstrap && yarn run build && yarn test',
        release: 'lerna publish',
        'release:force': 'yarn run release --force-publish=*',

        // Hooks
        prerelease: 'yarn run package',
      });
    } else {
      packageConfig.main = './lib/index.js';
      packageConfig.module = './esm/index.js';

      Object.assign(packageConfig.scripts, {
        babel: 'beemo babel --cjs',

        // Hooks
        preversion: 'yarn test',
        postversion: 'yarn run babel',
      });
    }

    // Save files
    const packagePath = path.join(tool.options.root, 'package.json');
    const lernaPath = path.join(tool.options.root, 'lerna.json');
    const promises = [fs.writeJSON(packagePath, packageConfig, { spaces: 2 })];

    if (options.workspaces) {
      promises.push(
        fs.writeJSON(
          lernaPath,
          {
            lerna: packageConfig.devDependencies.lerna.slice(1),
            version: 'independent',
            npmClient: 'yarn',
            useWorkspaces: true,
            commands: {
              publish: {
                ignore: ['*.md'],
              },
            },
          },
          { spaces: 2 },
        ),
      );
    }

    return Promise.all(promises);
  }
};
