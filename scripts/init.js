/* eslint-disable sort-keys */

const { Script } = require('@beemo/core');
const fs = require('fs-extra');
const path = require('path');

module.exports = class InitScript extends Script {
  parse() {
    return {
      boolean: ['local', 'workspaces'],
    };
  }

  run(options, tool) {
    const packageConfig = { ...tool.package };

    // Bemo
    Object.assign(packageConfig.beemo, {
      module: options.local ? '@local' : '@milesj/build-tool-config',
      drivers: ['babel', 'eslint', 'flow', 'jest', 'prettier'],
    });

    // Scripts
    Object.assign(packageConfig.scripts, {
      coverage: 'yarn run jest --coverage',
      eslint: 'beemo eslint --color --report-unused-disable-directives',
      flow: 'beemo flow check',
      jest: 'beemo jest --colors --logHeapUsage',
      prettier: 'beemo prettier --write ./README.md',

      // Hooks
      pretest: 'yarn run eslint --silent',
      test: 'yarn run jest --silent',
      posttest: 'yarn run flow --silent',
    });

    if (options.workspaces) {
      if (!packageConfig.devDependencies.lerna) {
        throw new Error(`Lerna must be installed to use workspaces.`);
      }

      packageConfig.name += '-root';
      packageConfig.private = true;
      packageConfig.workspaces = ['packages/*'];
      packageConfig.scripts.eslint += ' ./packages/*/{src,tests}';
      packageConfig.scripts.flow += ' --workspaces';
      packageConfig.scripts.jest += ' --workspaces';
      packageConfig.scripts.prettier +=
        ' "./packages/*/{bin,src,tests}/**/*.js" "./packages/*/*.{md,json}"';

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
      packageConfig.scripts.eslint += ' ./src ./tests';
      packageConfig.scripts.prettier += ' "./{bin,src,tests}/**/*.js" "./*.{md,json}"';

      Object.assign(packageConfig.scripts, {
        babel: 'yarn run babel:cjs && yarn run babel:esm',
        'babel:cjs': 'beemo babel ./src --out-dir ./lib --copy-files --cjs',
        'babel:esm': 'beemo babel ./src --out-dir ./esm --copy-files --esm',

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
