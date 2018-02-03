module.exports = function prettier() {
  return {
    arrowParens: 'avoid',
    bracketSpacing: true,
    jsxBracketSameLine: false,
    overrides: [
      {
        files: '*.md',
        options: { parser: 'markdown' },
      },
    ],
    parser: 'flow',
    printWidth: 100,
    proseWrap: 'always',
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'all',
    useTabs: false,
  };
};
