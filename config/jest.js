// --colors --logHeapUsage --detectLeaks

const path = require('path');

module.exports = function jest(options) {
  const setupFiles = [];
  const roots = [];

  if (options.workspaces) {
    roots.push('./packages');
  } else {
    roots.push('./src', './tests');
  }

  if (options.enzyme) {
    setupFiles.push(path.join(__dirname, './jest/enzyme.js'));
  }

  return {
    coverageDirectory: './coverage',
    coverageReporters: ['lcov'],
    globals: {
      __DEV__: true,
    },
    rootDir: process.cwd(),
    roots,
    setupFiles,
    // TODO make optional
    setupTestFrameworkScriptFile: path.join(process.cwd(), './tests/setup.js'),
    verbose: false,
  };
};
