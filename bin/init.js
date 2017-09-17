#! /usr/bin/env node
/* eslint-disable no-magic-numbers */

const fs = require('fs');
const path = require('path');
const options = require('yargs-parser')(process.argv.slice(2));

const PACKAGE_PATH = path.join(process.cwd(), 'package.json');
const LERNA_PATH = path.join(process.cwd(), 'lerna.json');
const isNode = options.node || false;
const lerna = options.lerna || false;

fs.readFile(PACKAGE_PATH, 'utf8', (error, data) => {
  if (error) {
    console.error('Failed to read package.json. Please run command from project root.');

    return;
  }

  const packageConfig = JSON.parse(data);

  // Config and scripts
  Object.assign(packageConfig.scripts, {
    babel: 'build-lib ./src -d ./lib',
    coverage: 'run-coverage',
    eslint: 'run-linter ./src ./tests',
    jest: 'run-tests',
    flow: 'type-check',
    posttest: 'yarn run flow',
    postversion: 'yarn run babel',
    pretest: 'yarn run eslint',
    preversion: 'yarn test',
    test: 'yarn run jest',
  });

  if (lerna) {
    packageConfig.private = true;
    packageConfig.workspaces = ['packages/*'];

    Object.assign(packageConfig.scripts, {
      assemble: 'yarn run clean && yarn run bootstrap && yarn run build && yarn test',
      bootstrap: 'lerna bootstrap --hoist',
      'bootstrap:slow': 'yarn run bootstrap -- --concurrency=1',
      build: 'lerna run build',
      clean: 'rimraf ./packages/{*}/lib/ && lerna clean --yes',
      outdated: 'yarn outdated; for dir in `find ./packages/ -type d -maxdepth 1`; do (cd "$dir" && yarn outdated); done;',
      publish: 'lerna publish',
      'publish:force': 'lerna publish --force-publish=*',
      updated: 'lerna updated',
    });

    delete packageConfig.scripts.babel;
    delete packageConfig.scripts.postversion;
    delete packageConfig.scripts.preversion;
  }

  // Babel
  packageConfig.babel = {
    extends: `./node_modules/@milesj/build-tool-config/babel${isNode ? '.node' : ''}.json5`,
  };

  // ESLint
  packageConfig.eslintConfig = {
    extends: `./node_modules/@milesj/build-tool-config/eslint${isNode ? '.node' : ''}.json5`,
  };

  packageConfig.eslintIgnore = [
    'lib/',
    '*.min.js',
    '*.map',
  ];

  if (lerna) {
    packageConfig.scripts.eslint += ' ./packages/*/{src,tests}';
  }

  // Jest
  packageConfig.jest = {
    preset: '@milesj/build-tool-config',
  };

  if (lerna) {
    packageConfig.jest.roots = ['./packages', './tests'];
    packageConfig.jest.testRegex = './packages/([-a-z]+)?/tests/.*\\.test\\.js$';
  }

  // Node.js
  if (packageConfig.engines) {
    packageConfig.engines.node = '>=6.5.0';
  } else {
    packageConfig.engines = {
      node: '>=6.5.0',
    };
  }

  fs.writeFile(PACKAGE_PATH, JSON.stringify(packageConfig, null, 2), 'utf8', (writeError) => {
    if (writeError) {
      console.error('Failed to update package.json', writeError);
      process.exit();
    } else {
      console.log('Updated package.json');
    }
  });

  // Lerna
  if (lerna) {
    const lernaConfig = {
      lerna: packageConfig.devDependencies.lerna.slice(1),
      version: 'independent',
      npmClient: 'yarn',
      useWorkspaces: true,
      commands: {
        publish: {
          ignore: ['*.md'],
        },
      },
    };

    fs.writeFile(LERNA_PATH, JSON.stringify(lernaConfig, null, 2), 'utf8', (writeError) => {
      if (writeError) {
        console.error('Failed to create lerna.json', writeError);
      } else {
        console.log('Created lerna.json');
      }
    });
  }
});
