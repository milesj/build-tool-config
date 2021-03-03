import { ESLintConfig } from '@beemo/driver-eslint';

const config: ESLintConfig = {
  rules: {
    'no-var': 'off',
    'no-console': 'off',
    'promise/always-return': 'off',
    'compat/compat': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};

export default config;
