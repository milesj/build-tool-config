module.exports = {
  coverageDirectory: './coverage',
  coverageReporters: ['lcov'],
  globals: { __DEV__: true },
  roots: ['./src', './tests'],
  setupTestFrameworkScriptFile: './tests/setup.js',
  verbose: false,
};
