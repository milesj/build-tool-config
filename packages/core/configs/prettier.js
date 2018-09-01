// Package: Run in root
// Workspaces: Run in root
module.exports = function prettier() {
  return {
    arrowParens: 'avoid',
    bracketSpacing: true,
    ignore: ['book.json', 'lerna.json', 'package.json', 'tsconfig.json', '*.d.ts'],
    jsxBracketSameLine: false,
    printWidth: 100,
    proseWrap: 'always',
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'all',
    useTabs: false,
  };
};