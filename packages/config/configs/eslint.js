/* eslint-disable no-magic-numbers, sort-keys */

const { EXTS, EXT_PATTERN, IGNORE_PATHS } = require('../constants');

// Package: Run in root
// Workspaces: Run in root
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['airbnb', 'prettier'],
  plugins: ['@typescript-eslint', 'promise', 'unicorn', 'compat', 'babel'],
  ignore: [...IGNORE_PATHS, '*.min.js', '*.map'],
  env: {
    browser: true,
  },
  globals: {
    __DEV__: true,
  },
  settings: {
    polyfills: ['promises'],
    'import/extensions': EXTS,
    'import/resolver': {
      node: {
        extensions: EXTS,
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'class-methods-use-this': 'off',
    'multiline-comment-style': 'off',
    'no-else-return': ['error', { allowElseIf: true }],
    'no-invalid-this': 'off', // Handled by babel/no-invalid-this
    'object-curly-spacing': 'off', // Handled by babel/object-curly-spacing
    'padded-blocks': [
      'error',
      {
        // Never apply to blocks
        classes: 'never',
        switches: 'never',
      },
    ],
    'babel/new-cap': 'error',
    'babel/no-invalid-this': 'error',
    'babel/object-curly-spacing': ['error', 'always'],
    'babel/semi': 'error',
    'compat/compat': 'error',
    'promise/always-return': 'error',
    'promise/avoid-new': 'off',
    'promise/catch-or-return': 'error',
    'promise/no-callback-in-promise': 'error',
    'promise/no-native': 'off',
    'promise/no-nesting': 'off',
    'promise/no-new-statics': 'error',
    'promise/no-promise-in-callback': 'error',
    'promise/no-return-in-finally': 'error',
    'promise/no-return-wrap': ['error', { allowReject: true }],
    'promise/param-names': 'error',
    'promise/valid-params': 'error',
    'react/sort-prop-types': 'off', // Handled by sort-keys
    'react/jsx-sort-default-props': 'off', // Handled by sort-keys
    'unicorn/catch-error-name': 'error',
    'unicorn/custom-error-definition': 'error',
    'unicorn/error-message': 'error',
    'unicorn/escape-case': 'error',
    'unicorn/explicit-length-check': 'error',
    'unicorn/filename-case': 'off',
    'unicorn/import-index': 'error',
    'unicorn/new-for-builtins': 'error',
    'unicorn/no-abusive-eslint-disable': 'off',
    'unicorn/no-array-instanceof': 'error',
    'unicorn/no-console-spaces': 'error',
    'unicorn/no-hex-escape': 'error',
    'unicorn/no-fn-reference-in-iterator': 'error',
    'unicorn/no-new-buffer': 'error',
    'unicorn/no-process-exit': 'error',
    'unicorn/no-unused-properties': 'error',
    'unicorn/number-literal-case': 'error',
    'unicorn/prefer-add-event-listener': 'error',
    'unicorn/prefer-exponentiation-operator': 'error',
    'unicorn/prefer-node-append': 'error',
    'unicorn/prefer-starts-ends-with': 'error',
    'unicorn/prefer-type-error': 'error',
    'unicorn/regex-shorthand': 'error',
    'unicorn/throw-new-error': 'error',

    // New and not in Airbnb
    'no-useless-catch': 'error',
    'react/jsx-fragments': ['error', 'syntax'],
    'react/no-typos': 'error',
    'react/no-unsafe': 'error',

    // Want to support but disabled in Airbnb
    complexity: ['error', 11],
    'max-classes-per-file': 'error',
    'max-lines-per-function': [
      'off',
      {
        max: 50,
        skipBlankLines: true,
        skipComments: true,
        IIFEs: true,
      },
    ],
    'newline-before-return': 'error',
    'no-constant-condition': 'error',
    'no-div-regex': 'error',
    'no-eq-null': 'error',
    'no-implicit-coercion': 'error',
    'no-magic-numbers': [
      'error',
      {
        ignore: [-1, 0, 1, 2, 3],
        ignoreArrayIndexes: true,
        enforceConst: true,
      },
    ],
    'no-misleading-character-class': 'error',
    'no-native-reassign': 'error',
    'no-negated-condition': 'error',
    'no-async-promise-executor': 'error',
    'no-useless-call': 'error',
    'prefer-object-spread': 'error',
    'require-atomic-updates': 'error',
    'require-unicode-regexp': 'error',
    'sort-keys': [
      'error',
      'asc',
      {
        caseSensitive: false,
        natural: true,
      },
    ],
    'import/default': 'error',
    'import/no-anonymous-default-export': [
      'error',
      {
        allowArray: true,
        allowLiteral: true,
        allowObject: true,
      },
    ],
    'react/forbid-foreign-prop-types': 'error',
    'react/jsx-handler-names': [
      'error',
      {
        eventHandlerPrefix: 'handle',
        eventHandlerPropPrefix: 'on',
      },
    ],
    'react/jsx-key': 'error',
    'react/jsx-no-literals': 'error',
    'react/no-did-mount-set-state': 'error',
    'react/no-direct-mutation-state': 'error',

    // Doesnt work with Prettier
    'function-paren-newline': 'off',
    'react/jsx-one-expression-per-line': 'off',
  },
  overrides: [
    {
      plugins: ['jest'],
      env: {
        jest: true,
        node: true,
      },
      files: [`tests/**/*.${EXT_PATTERN}`, `packages/*/tests/**/*.${EXT_PATTERN}`],
      rules: {
        'max-classes-per-file': 'off',
        'no-console': 'off',
        'no-magic-numbers': 'off',
        'sort-keys': 'off',
        'import/no-extraneous-dependencies': 'off',
        'jest/consistent-test-it': 'error',
        'jest/expect-expect': 'error',
        'jest/lowercase-name': 'off',
        'jest/no-identical-title': 'error',
        'jest/no-jasmine-globals': 'error',
        'jest/no-jest-import': 'error',
        'jest/no-test-prefixes': 'error',
        'jest/no-large-snapshots': 'error',
        'jest/prefer-to-be-null': 'error',
        'jest/prefer-to-be-undefined': 'error',
        'jest/prefer-to-have-length': 'error',
        'jest/valid-describe': 'error',
        'jest/valid-expect': 'error',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        camelcase: 'off',
        'no-unused-vars': ['warn', { vars: 'all', args: 'none', ignoreRestSiblings: true }],
        'import/extensions': [
          'error',
          'never',
          {
            json: 'always',
          },
        ],
        'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
        '@typescript-eslint/adjacent-overload-signatures': 'error',
        '@typescript-eslint/array-type': ['error', 'array'],
        '@typescript-eslint/camelcase': 'error',
        '@typescript-eslint/class-name-casing': 'error',
        '@typescript-eslint/member-delimiter-style': 'error',
        '@typescript-eslint/member-ordering': 'error',
        '@typescript-eslint/no-angle-bracket-type-assertion': 'error',
        '@typescript-eslint/no-empty-interface': 'error',
        '@typescript-eslint/no-array-constructor': 'error',
        '@typescript-eslint/no-inferrable-types': 'error',
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/no-namespace': 'error',
        '@typescript-eslint/no-parameter-properties': 'error',
        '@typescript-eslint/no-triple-slash-reference': 'error',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/no-use-before-define': 'error',
        '@typescript-eslint/no-var-requires': 'error',
        '@typescript-eslint/prefer-interface': 'error',
        '@typescript-eslint/prefer-namespace-keyword': 'error',
        '@typescript-eslint/type-annotation-spacing': 'error',

        // Doesnt work with TypeScript
        'no-restricted-globals': 'off',
        'no-undef': 'off',
        'import/no-cycle': 'off',
        'import/named': 'off',
        'react/destructuring-assignment': 'off',
        'unicorn/prefer-spread': 'off',
      },
    },
    {
      files: ['*.tsx'],
      rules: {
        'react/sort-comp': [
          'error',
          {
            order: [
              'statics',
              'properties',
              'lifecycle',
              'everything-else',
              'handlers',
              'renderers',
            ],
            groups: {
              statics: ['propTypes', 'defaultProps'],
              properties: [
                '/^(?!on).+$/',
                '/^(?!handle).+$/',
                '/^(?!render).+$/',
                '/^.+Ref$/',
                'state',
              ],
              lifecycle: [
                'constructor',
                'getDerivedStateFromProps',
                'componentDidMount',
                'shouldComponentUpdate',
                'getSnapshotBeforeUpdate',
                'componentDidUpdate',
                'componentDidCatch',
                'componentWillUnmount',
              ],
              handlers: ['/^on.+$/', '/^handle.+$/'],
              renderers: ['/^render.+$/', 'render'],
            },
          },
        ],
        '@typescript-eslint/member-ordering': 'off',
      },
    },
  ],
};
