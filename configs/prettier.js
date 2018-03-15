module.exports = function prettier() {
  return {
    arrowParens: 'avoid',
    bracketSpacing: true,
    ignore: ['package.json'],
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
