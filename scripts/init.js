/* eslint-disable sort-keys */

const { Script } = require('@beemo/core');
const fs = require('fs-extra');
const path = require('path');
const { MIN_IE_VERSION } = require('../configs/constants');

module.exports = class InitScript extends Script {
  parse() {
    return {
      boolean: ['docs', 'local', 'node', 'react', 'workspaces'],
      default: {
        docs: false,
        local: false,
        node: false,
        react: false,
        workspaces: false,
      },
    };
  }

  run(options, tool) {
    const packageConfig = { ...tool.package };

    // Beemo
    Object.assign(packageConfig.beemo, {
      module: options.local ? '@local' : '@milesj/build-tool-config',
      drivers: ['babel', 'eslint', 'jest', 'prettier', 'typescript'],
    });

    // Scripts
    Object.assign(packageConfig.scripts, {
      babel: 'beemo typescript', // TEMP
      build: 'yarn run babel && yarn run build:dts',
      'build:dts': 'beemo run-script generate-dts',
      clean: 'rimraf ./{lib,esm}/',
      coverage: 'yarn run jest --coverage',
      eslint: 'beemo eslint',
      jest: 'beemo jest',
      package: 'yarn run clean && yarn run build && yarn test',
      prettier: 'beemo prettier',
      release: 'np --yolo',
      type: 'beemo typescript --noEmit',

      // Hooks
      prerelease: 'yarn run package',
      pretest: 'yarn run type --silent',
      test: 'yarn run jest --silent',
      posttest: 'yarn run eslint --silent',
    });

    if (options.docs) {
      Object.assign(packageConfig.scripts, {
        docs: 'gitbook build --debug',
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

      if (!packageConfig.workspaces) {
        packageConfig.workspaces = ['packages/*'];
      }

      packageConfig.private = true;

      Object.assign(packageConfig.scripts, {
        babel: 'beemo run-script build-packages', // TODO typescript
        build: 'yarn run babel', // TODO dts
        clean: 'rimraf ./packages/*/{lib,esm}/ && lerna clean --yes',
        release: 'lerna publish',
        'release:force': 'yarn run release --force-publish=*',
      });
    } else {
      packageConfig.main = './lib/index.js';
      packageConfig.module = './esm/index.js';
    }

    if (options.node) {
      packageConfig.scripts.babel += ' --node';
    } else {
      packageConfig.browserslist = [`ie ${MIN_IE_VERSION}`];
    }

    if (options.react) {
      packageConfig.scripts.babel += ' --react';
      packageConfig.scripts.jest += ' --react';
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
