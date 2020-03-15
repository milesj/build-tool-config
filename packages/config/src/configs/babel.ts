import { BabelConfig, BabelDriverArgs } from '@beemo/driver-babel';
import { MIN_IE_VERSION, MIN_NODE_VERSION } from '../constants';
import { BeemoProcess } from '../types';

interface Args extends BabelDriverArgs {
  esm?: boolean;
}

// Package: Run in root
// Workspaces: Run in each package (using --config-file option)
const { context, tool } = (process.beemo as unknown) as BeemoProcess<Args>;
const { decorators = false, node = false, react = false } = tool.config.settings;

const plugins: BabelConfig['plugins'] = [
  ['@babel/plugin-proposal-class-properties', { loose: decorators }],
  '@babel/plugin-proposal-export-default-from',
  '@babel/plugin-proposal-nullish-coalescing-operator',
  '@babel/plugin-proposal-optional-catch-binding',
  '@babel/plugin-proposal-optional-chaining',
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
      modules: context.args.esm ? false : 'commonjs',
      shippedProposals: true,
      targets:
        // eslint-disable-next-line no-nested-ternary
        process.env.NODE_ENV === 'test'
          ? { node: 'current' }
          : node
          ? { node: MIN_NODE_VERSION }
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
