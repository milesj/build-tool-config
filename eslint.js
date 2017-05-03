module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: ['airbnb'],
  plugins: ['flowtype'],
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: true,
    },
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2017,
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
  },
  rules: {
    // Do not want to support
    'class-methods-use-this': 'off',
    'no-console': 'off',
    'padded-blocks': 'off',

    // Want to support, but disabled in Airbnb
    complexity: ['error', 11],
    'jsx-quotes': ['error', 'prefer-double'],
    'newline-before-return': 'error',
    'no-compare-neg-zero': 'error',
    'no-constant-condition': 'error',
    'no-div-regex': 'error',
    'no-eq-null': 'error',
    'no-extra-parens': ['error', 'all', {
      conditionalAssign: true,
      nestedBinaryExpressions: false,
      returnAssign: false,
      ignoreJSX: 'all',
    }],
    'no-implicit-coercion': 'error',
    'no-invalid-this': 'error',
    'no-magic-numbers': ['error', {
      ignoreArrayIndexes: true,
      enforceConst: true,
    }],
    'no-native-reassign': 'error',
    'no-negated-condition': 'error',
    'no-useless-call': 'error',
    'prefer-destructuring': 'error',
    'prefer-promise-reject-errors': ['error', {
      allowEmptyReject: true,
    }],
    'sort-imports': ['error', {
      ignoreCase: false,
      ignoreMemberSort: false,
      memberSyntaxSortOrder: ['single', 'multiple', 'all', 'none'],
    }],
    'import/default': 'error',
    'import/named': 'error',
    'import/order': ['error', {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'never',
    }],

    // Flowtype support
    'flowtype/boolean-style': 'error',
    'flowtype/define-flow-type': 'error',
    'flowtype/delimiter-dangle': ['error', 'always-multiline'],
    'flowtype/generic-spacing': ['error', 'never'],
    'flowtype/no-dupe-keys': 'error',
    'flowtype/no-primitive-constructor-types': 'error',
    'flowtype/no-types-missing-file-annotation': 'error',
    'flowtype/no-weak-types': ['error', {
      any: true,
      Object: false,
      Function: true,
    }],
    'flowtype/object-type-delimiter': ['error', 'comma'],
    'flowtype/require-parameter-type': ['error', {
      excludeArrowFunctions: true,
    }],
    'flowtype/require-return-type': ['error', {
      excludeArrowFunctions: true,
    }],
    'flowtype/require-valid-file-annotation': ['error', 'always'],
    'flowtype/require-variable-type': 'off',
    'flowtype/semi': ['error', 'always'],
    'flowtype/sort-keys': ['error', 'asc', {
      natural: true,
    }],
    'flowtype/space-after-type-colon': ['error', 'always', {
      allowLineBreak: false,
    }],
    'flowtype/space-before-generic-bracket': ['error', 'never'],
    'flowtype/space-before-type-colon': ['error', 'never'],
    'flowtype/type-id-match': 'off',
    'flowtype/union-intersection-spacing': ['error', 'always'],
    'flowtype/use-flow-type': 'error',
  },
};
