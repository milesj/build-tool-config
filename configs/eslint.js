/* eslint-disable no-magic-numbers, sort-keys */

const { EXTS, EXT_PATTERN } = require('./constants');

// Package: Run in root
// Workspaces: Run in root
module.exports = function eslint() {
  return {
    root: true,
    parser: 'typescript-eslint-parser',
    extends: ['airbnb', 'prettier'],
    plugins: ['typescript', 'promise', 'unicorn', 'compat', 'babel'],
    ignore: ['esm/', 'lib/', '*.min.js', '*.map'],
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
        'typescript-eslint-parser': ['.ts', '.tsx'],
      },
    },
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 2018,
      ecmaFeatures: {
        jsx: true,
        experimentalObjectRestSpread: true,
      },
    },
    rules: {
      'class-methods-use-this': 'off',
      'multiline-comment-style': 'off',
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
      'import/no-extraneous-dependencies': 'off',
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
      'unicorn/catch-error-name': ['error', { name: 'error' }],
      'unicorn/custom-error-definition': 'error',
      'unicorn/error-message': 'error',
      'unicorn/escape-case': 'error',
      'unicorn/explicit-length-check': 'error',
      'unicorn/filename-case': 'off',
      'unicorn/import-index': 'error',
      'unicorn/new-for-builtins': 'error',
      'unicorn/no-abusive-eslint-disable': 'off',
      'unicorn/no-array-instanceof': 'error',
      'unicorn/no-hex-escape': 'error',
      'unicorn/no-fn-reference-in-iterator': 'error',
      'unicorn/no-new-buffer': 'error',
      'unicorn/no-process-exit': 'error',
      'unicorn/number-literal-case': 'error',
      'unicorn/prefer-add-event-listener': 'error',
      'unicorn/prefer-starts-ends-with': 'error',
      'unicorn/prefer-type-error': 'error',
      'unicorn/regex-shorthand': 'error',
      'unicorn/throw-new-error': 'error',

      // New and not yet in Airbnb
      'implicit-arrow-linebreak': 'off',
      'lines-between-class-members': 'error',
      'import/group-exports': 'off',
      'import/no-default-export': 'off',
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'error',
      'react/button-has-type': 'error',
      'react/destructuring-assignment': 'off', // Broken with TS
      'react/no-access-state-in-setstate': 'error',
      'react/no-this-in-sfc': 'error',

      // Want to support but disabled in Airbnb
      complexity: ['error', 11],
      'jsx-quotes': ['error', 'prefer-double'],
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
      'no-native-reassign': 'error',
      'no-negated-condition': 'error',
      'no-useless-call': 'error',
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
      'react/jsx-no-literals': 'off', // Broken
      'react/no-did-mount-set-state': 'off', // 16.3+
      'react/no-did-update-set-state': 'off', // 16.3+
      'react/no-direct-mutation-state': 'error',

      // TypeScript support
      'import/extensions': [
        'error',
        'never',
        {
          json: 'always',
        },
      ],
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
      'typescript/adjacent-overload-signatures': 'error',
      'typescript/class-name-casing': 'error',
      'typescript/member-delimiter-style': 'error',
      'typescript/member-ordering': 'error',
      'typescript/no-angle-bracket-type-assertion': 'error',
      'typescript/no-empty-interface': 'error',
      'typescript/no-array-constructor': 'error',
      'typescript/no-triple-slash-reference': 'error',
      'typescript/no-parameter-properties': 'error',
      'typescript/no-unused-vars': 'error',
      'typescript/no-use-before-define': 'error',
      'typescript/prefer-namespace-keyword': 'error',
      'typescript/type-annotation-spacing': 'error',

      // Doesnt work with Prettier
      'function-paren-newline': 'off',
      'react/jsx-one-expression-per-line': 'off',

      // Doesnt work with TypeScript
      'no-restricted-globals': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'import/named': 'off',
      'unicorn/prefer-spread': 'off',
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
          'no-magic-numbers': 'off',
          'sort-keys': 'off',
          'jest/consistent-test-it': 'error',
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
        files: ['{src,tests}/**/*.tsx', 'packages/*/{src,tests}/**/*.tsx'],
        rules: {
          'typescript/member-ordering': 'off',
          'react/sort-comp': [
            'error',
            {
              order: [
                'statics',
                'properties',
                'lifecycle',
                'everything-else',
                'handlers',
                'rendering',
              ],
              groups: {
                statics: ['propTypes', 'defaultProps'],
                properties: ['/^(?!on).+$/', '/^(?!handle).+$/', '/^.+Ref$/', 'state'],
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
        },
      },
    ],
  };
};
