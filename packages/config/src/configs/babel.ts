import { BabelConfig } from '@beemo/driver-babel';
import { MIN_IE_VERSION, MIN_NODE_VERSION } from '../constants';

// Package: Run in root
// Workspaces: Run in each package (using --config-file option)
const { context, tool } = process.beemo;
const { decorators = false, node = false, react = false } = tool.config.settings;

const plugins: BabelConfig['plugins'] = [
  ['@babel/plugin-proposal-class-properties', { loose: true }],
  '@babel/plugin-proposal-export-default-from',
  ['babel-plugin-transform-dev', { evaluate: false }],
];

// Must be before class properties
if (decorators) {
  plugins.unshift(['@babel/plugin-proposal-decorators', { legacy: true }]);
}

// Order is important!
const presets: BabelConfig['presets'] = [
  [
    '@babel/preset-env',
    {
      loose: true,
      modules: context.getRiskyOption('esm') ? false : 'commonjs',
      shippedProposals: true,
      targets: node
        ? { node: tool.package?.engines?.node?.replace('>=', '') || MIN_NODE_VERSION }
        : { ie: MIN_IE_VERSION },
    },
  ],
  '@babel/preset-typescript',
];

if (react) {
  presets.push('@babel/preset-react');
  plugins.push('babel-plugin-typescript-to-proptypes');
}

const config: BabelConfig = {
  babelrc: false,
  comments: false,
  plugins,
  presets,
};

export default config;
