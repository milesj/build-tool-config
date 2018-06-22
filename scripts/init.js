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

  run(args, tool) {
    const packageConfig = { ...tool.package };

    // Beemo
    Object.assign(packageConfig.beemo, {
      module: args.local ? '@local' : '@milesj/build-tool-config',
      drivers: [
        'babel',
        'eslint',
        args.workspaces ? { driver: 'jest', dependencies: ['typescript'] } : 'jest',
        'prettier',
        'typescript',
      ],
    });

    // Scripts
    Object.assign(packageConfig.scripts, {
      build: 'beemo typescript',
      coverage: 'yarn run jest --coverage',
      eslint: 'beemo eslint',
      jest: 'beemo jest',
      prettier: 'beemo prettier',
      release: 'np --yolo --no-yarn',
      type: 'beemo typescript --noEmit',

      // Hooks
      prerelease: 'yarn test && yarn run build',
      pretest: 'yarn run type',
      test: 'yarn run jest',
      posttest: 'yarn run eslint',
    });

    if (args.docs) {
      Object.assign(packageConfig.scripts, {
        docs: 'gitbook build --debug --log=debug',
        'docs:serve': 'gitbook serve',
        'docs:install': 'gitbook install',
      });
    }

    if (args.workspaces) {
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
        build: 'beemo typescript --workspaces=* --priority=core',
        release: 'lerna publish',
        type: 'beemo typescript --workspaces=* --noEmit',
      });
    } else {
      packageConfig.main = './lib/index.js';
      packageConfig.types = './lib/index.d.ts';
      packageConfig.module = './esm/index.js';
    }

    if (args.node) {
      packageConfig.scripts.build += ' --node';
    } else {
      packageConfig.browserslist = [`ie ${MIN_IE_VERSION}`];
    }

    if (args.react) {
      packageConfig.scripts.build += ' --react';
      packageConfig.scripts.jest += ' --react';
      packageConfig.scripts.type += ' --react';
    }

    // Save files
    const packagePath = path.join(tool.options.root, 'package.json');
    const lernaPath = path.join(tool.options.root, 'lerna.json');
    const promises = [fs.writeJSON(packagePath, packageConfig, { spaces: 2 })];

    if (args.workspaces) {
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
