const { Script } = require('@beemo/core');
const fs = require('fs-extra');
const path = require('path');
const { CJS_FOLDER, ESM_FOLDER, MIN_IE_VERSION, MIN_NODE_VERSION } = require('../constants');

module.exports = class InitScript extends Script {
  args() {
    return {
      boolean: ['local', 'node', 'react', 'workspaces'],
      default: {
        local: false,
        node: false,
        react: false,
        workspaces: false,
      },
    };
  }

  blueprint() {
    return {};
  }

  execute(context, args) {
    const packageConfig = {
      ...this.tool.package,
      scripts: {},
    };

    // Beemo
    Object.assign(packageConfig.beemo, {
      module: args.local ? '@local' : '@milesj/build-tools',
      drivers: ['babel', 'eslint', 'jest', 'prettier', 'typescript'],
      settings: {},
    });

    if (args.node) {
      packageConfig.beemo.settings.node = true;
    }

    if (args.react) {
      packageConfig.beemo.settings.react = true;
    }

    // Scripts
    Object.assign(packageConfig.scripts, {
      prepare: 'beemo create-config --silent',
      build: 'beemo run-script build',
      coverage: 'yarn run jest --coverage',
      eslint: 'beemo eslint',
      jest: 'beemo jest',
      prettier: 'beemo prettier',
      release: 'npx np --yolo --no-yarn',
      type: 'beemo typescript --noEmit',

      // Hooks
      prerelease: 'yarn test && yarn run build',
      pretest: 'yarn run type',
      test: 'yarn run jest',
      posttest: 'yarn run eslint',
    });

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
        build: 'beemo run-script build --workspaces=* && yarn run type --emitDeclarationOnly',
        release: 'lerna publish',
        type: 'beemo typescript --build --reference-workspaces',
      });
    } else {
      packageConfig.main = `./${CJS_FOLDER}/index.js`;
      packageConfig.module = `./${ESM_FOLDER}/index.js`;
      packageConfig.types = `./${CJS_FOLDER}/index.d.ts`;
      packageConfig.sideEffects = false;
    }

    if (args.node) {
      packageConfig.scripts.build = packageConfig.scripts.type.replace('--noEmit', '').trim();
      packageConfig.engines = { node: `>=${MIN_NODE_VERSION}` };
    } else {
      packageConfig.browserslist = [`ie ${MIN_IE_VERSION}`];
    }

    // Save files
    const packagePath = path.join(this.tool.options.root, 'package.json');
    const lernaPath = path.join(this.tool.options.root, 'lerna.json');
    const promises = [fs.writeJSON(packagePath, packageConfig, { spaces: 2 })];

    if (args.workspaces) {
      promises.push(
        fs.writeJSON(
          lernaPath,
          {
            version: 'independent',
            npmClient: 'yarn',
            useWorkspaces: true,
            command: {
              publish: {
                ignoreChanges: ['*.md'],
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
