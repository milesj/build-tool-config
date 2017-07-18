#! /usr/bin/env node
/* eslint-disable no-magic-numbers */
const fs = require('fs');
const path = require('path');
const options = require('yargs-parser')(process.argv.slice(2));

const PACKAGE_PATH = path.join(process.cwd(), 'package.json');
const packageConfig = fs.readFileSync(PACKAGE_PATH, 'utf8');
const isNode = options.node || false;

packageConfig.babel = {
  extends: `./node_modules/@milesj/build-tool-config/babel${isNode ? '.node' : ''}.json5`,
};

packageConfig.eslintConfig = {
  extends: `./node_modules/@milesj/build-tool-config/eslint${isNode ? '.node' : ''}.json5`,
};

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

fs.writeFile(PACKAGE_PATH, JSON.stringify(packageConfig, null, '  '), 'utf8', (error) => {
  if (error) {
    console.error('Failed to update package.json', error);
  } else {
    console.log('Updated package.json');
  }
});
