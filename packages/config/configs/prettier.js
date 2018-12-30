const { IGNORE_PATHS } = require('../constants');

// Package: Run in root
// Workspaces: Run in root
module.exports = {
  arrowParens: 'avoid',
  bracketSpacing: true,
  ignore: [...IGNORE_PATHS, 'book.json', 'lerna.json', 'package.json', 'tsconfig.json', '*.d.ts'],
  jsxBracketSameLine: false,
  printWidth: 100,
  proseWrap: 'always',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
};
