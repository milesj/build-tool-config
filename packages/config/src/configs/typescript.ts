import { TypeScriptConfig } from '@beemo/driver-typescript';
import { CJS_FOLDER } from '../constants';
import { BeemoProcess, Settings } from '../types';

// Package: Run in root
// Workspaces: Run in each package (copied into each)
const { context, tool } = process.beemo as BeemoProcess;
const { node, react } = tool.config.settings as Settings;

const compilerOptions: TypeScriptConfig['compilerOptions'] = {
  allowJs: false,
  allowSyntheticDefaultImports: true,
  declaration: true,
  esModuleInterop: true,
  experimentalDecorators: !!context.args.decorators || false,
  forceConsistentCasingInFileNames: true,
  lib: ['dom', 'esnext'],
  module: 'commonjs',
  noEmitOnError: true,
  noImplicitReturns: true,
  pretty: true,
  removeComments: false,
  sourceMap: !!context.args.sourceMaps || false,
  strict: true,
  target: node ? 'es2018' : 'es5',
  useDefineForClassFields: process.env.NODE_ENV === 'development',
};
const include: string[] = [];

if (react) {
  compilerOptions.jsx = 'react';
}

if (!context.args.referenceWorkspaces) {
  include.push('./src/**/*', './types/**/*');

  // When --noEmit is passed, we want to run the type checker and include test files.
  // Otherwise, we do not want to emit declarations for test files.
  if (context.args.noEmit) {
    include.push('./tests/**/*');
  }

  compilerOptions.outDir = `./${CJS_FOLDER}`;
}

const config: TypeScriptConfig = {
  compilerOptions,
  include,
};

export default config;
