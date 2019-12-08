import { BabelConfig } from '@beemo/driver-babel';
import { MIN_IE_VERSION, MIN_NODE_VERSION } from '../constants';
import { Settings, BeemoProcess } from '../types';

// Package: Run in root
// Workspaces: Run in each package (using --config-file option)
const { context, tool } = process.beemo as BeemoProcess;
const { node, react } = tool.config.settings as Settings;

const plugins: BabelConfig['plugins'] = [
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-export-default-from',
  '@babel/plugin-proposal-nullish-coalescing-operator',
  '@babel/plugin-proposal-optional-catch-binding',
  '@babel/plugin-proposal-optional-chaining',
  ['babel-plugin-transform-dev', { evaluate: false }],
];

// Order is important!
const presets: BabelConfig['presets'] = [
  [
    '@babel/preset-env',
    {
      loose: true,
      modules: context.args.esm ? false : 'commonjs',
      shippedProposals: true,
      targets: node ? { node: MIN_NODE_VERSION } : { ie: MIN_IE_VERSION },
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
