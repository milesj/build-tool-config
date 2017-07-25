#! /usr/bin/env node
/* eslint-disable no-magic-numbers */
const fs = require('fs');
const path = require('path');
const options = require('yargs-parser')(process.argv.slice(2));

const PACKAGE_PATH = path.join(process.cwd(), 'package.json');
const isNode = options.node || false;

fs.readFile(PACKAGE_PATH, 'utf8', (error, data) => {
  if (error) {
    console.error('Failed to read package.json. Please run command from project root.');

    return;
  }

  const packageConfig = JSON.parse(data);

  packageConfig.babel = {
    extends: `./node_modules/@milesj/build-tool-config/babel${isNode ? '.node' : ''}.json5`,
  };

  packageConfig.eslintConfig = {
    extends: `./node_modules/@milesj/build-tool-config/eslint${isNode ? '.node' : ''}.json5`,
  };

  packageConfig.eslintIgnore = [
    'lib/',
    '*.min.js',
    '*.map',
  ];

  packageConfig.jest = {
    preset: '@milesj/build-tool-config',
  };

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
    } else {
      console.log('Updated package.json');
    }
  });
});
