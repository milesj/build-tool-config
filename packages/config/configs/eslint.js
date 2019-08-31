/* eslint-disable no-magic-numbers, sort-keys */

const path = require('path');
const glob = require('fast-glob');
const { EXTS, EXT_PATTERN, IGNORE_PATHS } = require('../constants');

const { tool } = process.beemo;
const { node } = tool.config.settings;
const workspacesEnabled = !!tool.package.workspaces;
const project = [path.join(process.cwd(), 'tsconfig.json')];

if (workspacesEnabled) {
  tool.getWorkspacePaths({ relative: true }).forEach(wsPath => {
    glob
      .sync(path.join(process.cwd(), wsPath.replace('*', '**'), 'tsconfig.json'), {
        absolute: true,
      })
      .forEach(configPath => {
        project.push(configPath);
      });
  });
}

// Package: Run in root
// Workspaces: Run in root
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['airbnb', 'prettier', 'prettier/react', 'prettier/@typescript-eslint'],
  plugins: ['react-hooks', 'promise', 'unicorn', 'compat', 'babel'],
  ignore: [...IGNORE_PATHS, '*.min.js', '*.map'],
  env: {
    browser: true,
  },
  globals: {
    __DEV__: 'readable',
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
  reportUnusedDisableDirectives: true,
  rules: {
    'class-methods-use-this': 'off',
    'multiline-comment-style': 'off',
    'no-else-return': ['error', { allowElseIf: true }],
    'no-invalid-this': 'off', // Handled by babel/no-invalid-this
    'object-curly-spacing': 'off', // Handled by babel/object-curly-spacing
    // 'padded-blocks': [
    //   'error',
    //   {
    //     // Never apply to blocks
    //     classes: 'never',
    //     switches: 'never',
    //   },
    // ],

    // BABEL
    'babel/new-cap': 'error',
    'babel/no-invalid-this': 'error',
    'babel/object-curly-spacing': ['error', 'always'],
    'babel/semi': 'error',

    // COMPAT
    'compat/compat': node ? 'off' : 'warn',

    // IMPORT
    'import/prefer-default-export': 'off',

    // PROMISE
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

    // REACT
    'react/sort-prop-types': 'off', // Handled by sort-keys
    'react/state-in-constructor': 'off',
    'react/static-property-placement': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-sort-default-props': 'off', // Handled by sort-keys

    // UNICORN
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
    'unicorn/no-fn-reference-in-iterator': 'error',
    'unicorn/no-for-loop': 'error',
    'unicorn/no-hex-escape': 'error',
    'unicorn/no-new-buffer': 'error',
    'unicorn/no-process-exit': 'error',
    'unicorn/no-unused-properties': 'error',
    'unicorn/no-zero-fractions': 'error',
    'unicorn/number-literal-case': 'error',
    'unicorn/prefer-add-event-listener': 'error',
    'unicorn/prefer-event-key': 'error',
    'unicorn/prefer-exponentiation-operator': 'error',
    'unicorn/prefer-flat-map': 'error',
    'unicorn/prefer-includes': 'error',
    'unicorn/prefer-node-append': 'error',
    'unicorn/prefer-node-remove': 'error',
    'unicorn/prefer-starts-ends-with': 'error',
    'unicorn/prefer-text-content': 'error',
    'unicorn/prefer-type-error': 'error',
    'unicorn/regex-shorthand': 'error',
    'unicorn/throw-new-error': 'error',

    // New and not in Airbnb
    'react/no-typos': 'error',
    'react/no-unsafe': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',

    // Want to support but disabled in Airbnb
    complexity: ['error', 11],
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
    'no-native-reassign': 'error',
    'no-negated-condition': 'error',
    'no-useless-call': 'error',
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
    'import/default': 'off', // Super slow with TS
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
      files: ['*.ts', '*.tsx'],
      plugins: ['@typescript-eslint'],
      parserOptions: {
        project,
      },
      rules: {
        camelcase: 'off',
        'no-unused-vars': ['error', { vars: 'all', args: 'none', ignoreRestSiblings: true }],
        'import/extensions': [
          'error',
          'never',
          {
            json: 'always',
          },
        ],
        'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
        '@typescript-eslint/adjacent-overload-signatures': 'error',
        '@typescript-eslint/array-type': ['error', { default: 'array' }],
        '@typescript-eslint/camelcase': 'error',
        '@typescript-eslint/class-name-casing': 'error',
        '@typescript-eslint/consistent-type-assertions': [
          'error',
          { assertionStyle: 'as', objectLiteralTypeAssertions: 'allow-as-parameter' },
        ],
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/member-delimiter-style': 'error',
        '@typescript-eslint/member-ordering': 'error',
        '@typescript-eslint/no-array-constructor': 'error',
        '@typescript-eslint/no-empty-interface': 'error',
        '@typescript-eslint/no-explicit-any': ['error', { ignoreRestArgs: true }],
        '@typescript-eslint/no-inferrable-types': [
          'error',
          {
            ignoreProperties: true,
            ignoreParameters: true,
          },
        ],
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/no-misused-promises': 'error',
        '@typescript-eslint/no-namespace': 'error',
        '@typescript-eslint/no-parameter-properties': 'error',
        '@typescript-eslint/no-unnecessary-qualifier': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          { vars: 'all', args: 'none', ignoreRestSiblings: true },
        ],
        '@typescript-eslint/no-use-before-define': 'error',
        '@typescript-eslint/no-var-requires': 'off', // No Babel support
        '@typescript-eslint/prefer-namespace-keyword': 'error',
        '@typescript-eslint/prefer-readonly': 'off', // Annoying with handlers
        '@typescript-eslint/require-await': 'warn',
        '@typescript-eslint/triple-slash-reference': 'error',
        '@typescript-eslint/unified-signatures': 'error',
        '@typescript-eslint/type-annotation-spacing': 'error',

        // Doesnt work with TypeScript
        'no-restricted-globals': 'off',
        'no-undef': 'off',
        'import/no-cycle': 'off',
        'import/named': 'off',
        'react/destructuring-assignment': 'off',
        'unicorn/no-fn-reference-in-iterator': 'off',
        'unicorn/no-keyword-prefix': 'off',
        'unicorn/prefer-spread': 'off',
      },
    },
    {
      files: ['*.tsx'],
      plugins: ['@typescript-eslint'],
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
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    {
      files: [`*.test.${EXT_PATTERN}`],
      plugins: ['jest'],
      env: {
        jest: true,
        node: true,
      },
      rules: {
        'max-classes-per-file': 'off',
        'no-console': 'off',
        'no-magic-numbers': 'off',
        'sort-keys': 'off',
        'compat/compat': 'off',
        'import/no-extraneous-dependencies': 'off',
        'jest/consistent-test-it': 'error',
        'jest/expect-expect': 'error',
        'jest/lowercase-name': 'off',
        'jest/no-duplicate-hooks': 'error',
        'jest/no-export': 'error',
        'jest/no-identical-title': 'error',
        'jest/no-if': 'error',
        'jest/no-jasmine-globals': 'error',
        'jest/no-jest-import': 'error',
        'jest/no-large-snapshots': 'error',
        'jest/no-standalone-expect': 'error',
        'jest/no-test-prefixes': 'error',
        'jest/prefer-to-be-null': 'error',
        'jest/prefer-to-be-undefined': 'error',
        'jest/prefer-to-have-length': 'error',
        'jest/require-top-level-describe': 'error',
        'jest/valid-describe': 'error',
        'jest/valid-expect': 'error',
      },
    },
  ],
};
