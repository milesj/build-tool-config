import { TypeScriptConfig, TypeScriptDriverArgs } from '@beemo/driver-typescript';
import { CJS_FOLDER } from '../constants';
import { BeemoProcess } from '../types';

interface Args extends TypeScriptDriverArgs {
  decorators?: boolean;
  sourceMaps?: boolean;
}

// Package: Run in root
// Workspaces: Run in each package (copied into each)
const { context, tool } = (process.beemo as unknown) as BeemoProcess<Args>;
const { decorators = false, node = false, react = false } = tool.config.settings;

const compilerOptions: TypeScriptConfig['compilerOptions'] = {
  allowJs: false,
  allowSyntheticDefaultImports: true,
  declaration: true,
  esModuleInterop: true,
  experimentalDecorators: decorators,
  forceConsistentCasingInFileNames: true,
  lib: ['esnext'],
  module: 'commonjs',
  noEmitOnError: true,
  noImplicitReturns: true,
  pretty: true,
  removeComments: false,
  resolveJsonModule: true,
  sourceMap: context.args.sourceMaps || false,
  strict: true,
  target: node ? 'es2018' : 'es5',
  useDefineForClassFields: false,
};
const include: string[] = [];

if (react) {
  compilerOptions.lib!.push('dom');
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
