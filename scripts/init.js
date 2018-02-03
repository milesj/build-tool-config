/* eslint-disable sort-keys */

const { Script } = require('@beemo/core');
const fs = require('fs-extra');
const path = require('path');

module.exports = class InitScript extends Script {
  parse() {
    return {
      boolean: ['workspaces'],
    };
  }

  run(options, tool) {
    const packageConfig = { ...tool.package };

    // Bemo
    packageConfig.beemo = {
      config: '@milesj/build-tool-config',
      drivers: ['babel', 'eslint', 'flow', 'jest', 'prettier'],
    };

    // Scripts
    Object.assign(packageConfig.scripts, {
      babel: 'beemo babel ./src --out-dir ./lib --copy-files',
      coverage: 'yarn run jest --coverage',
      eslint: 'beemo eslint --color --report-unused-disable-directives',
      flow: 'beemo flow check',
      jest: 'beem jest --colors --logHeapUsage',
      prettier: 'beemo prettier --write ./README.md',

      // Hooks
      pretest: 'yarn run eslint',
      test: 'yarn run jest',
      posttest: 'yarn run flow',
    });

    if (options.workspaces) {
      if (!packageConfig.devDependencies.lerna) {
        throw new Error(`Lerna must be installed to use workspaces.`);
      }

      packageConfig.private = true;
      packageConfig.workspaces = ['packages/*'];
      packageConfig.scripts.eslint += ' ./packages/*/{src,tests}';
      packageConfig.scripts.flow += ' --workspaces';
      packageConfig.scripts.jest += ' --workspaces';
      packageConfig.scripts.prettier += ' ./packages/*/{src,tests}/**/*.{js,json,md}';

      // TODO build babel???
      Object.assign(packageConfig.scripts, {
        bootstrap: 'lerna bootstrap',
        'bootstrap:slow': 'yarn run bootstrap --concurrency=1',
        clean: 'rimraf ./packages/*/{lib,esm}/ && lerna clean --yes',
        package: 'yarn run bootstrap && yarn test',
        release: 'lerna publish',
        'release:force': 'yarn run release --force-publish=*',

        // Hooks
        prerelease: 'yarn run package',
      });
    } else {
      packageConfig.main = './lib/index.js';
      packageConfig.module = './esm/index.js';
      packageConfig.scripts.eslint += ' ./src ./tests';
      packageConfig.scripts.prettier += ' ./{src,tests}/**/*.{js,json,md}';

      Object.assing(packageConfig.scripts, {
        preversion: 'yarn test',
        postversion: 'yarn run babel',
      });
    }

    // Save files
    const packagePath = path.join(tool.options.root, 'package.json');
    const lernaPath = path.join(tool.options.root, 'lerna.json');
    const promises = [fs.writeJSON(packagePath, packageConfig, { spaces: 2 })];

    if (options.workspaces) {
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
      );
    }

    return Promise.all(promises);
  }
};
