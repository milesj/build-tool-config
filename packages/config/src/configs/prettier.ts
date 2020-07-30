import { PrettierConfig } from '@beemo/driver-prettier';
import { IGNORE_PATHS } from '../constants';

// Package: Run in root
// Workspaces: Run in root
const config: PrettierConfig = {
  arrowParens: 'always',
  bracketSpacing: true,
  endOfLine: 'lf',
  ignore: [...IGNORE_PATHS, 'lerna.json', 'package.json', 'tsconfig.json', '*.d.ts'],
  jsxBracketSameLine: false,
  printWidth: 100,
  proseWrap: 'always',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
};

export default config;
