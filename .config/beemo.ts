import { BeemoConfig } from '@beemo/core';

const config: BeemoConfig = {
  module: '@milesj/build-tool-config',
  drivers: [
    'babel',
    'eslint',
    'jest',
    'prettier',
    ['typescript', { declarationOnly: true, buildFolder: 'dts' }],
  ],
  settings: {
    node: true,
  },
};

export default config;
