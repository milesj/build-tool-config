const fs = require('fs-extra');
const path = require('path');
const { EXTS, DIR_PATTERN } = require('./configs/constants');

const extsWithoutJSON = EXTS.filter(ext => ext !== '.json');

function isEmptyArgs(args, name) {
  return args.length === 0 || (args.length === 1 && args[0] === name);
}

module.exports = function milesj(tool) {
  const usingTypeScript = tool.config.drivers.includes('typescript');
  const workspacesEnabled = !!tool.package.workspaces;

  // Babel
  tool.on('babel.init-driver', (driver, argv, { args }) => {
    argv.push('--copy-files');

    if (usingTypeScript && !args.extensions) {
      argv.push('--extensions', extsWithoutJSON.join(','));
    }

    if (isEmptyArgs(args._, 'babel')) {
      if (args.esm) {
        argv.push('./src', '--out-dir', './esm');
      } else {
        argv.push('./src', '--out-dir', './lib');
      }
    }
  });

  // ESLint
  tool.on('eslint.init-driver', (driver, argv, { args }) => {
    argv.push('--color', '--report-unused-disable-directives');

    if (usingTypeScript && !args.ext) {
      argv.push('--ext', extsWithoutJSON.join(','));
    }

    if (isEmptyArgs(args._, 'eslint')) {
      argv.push('./src', './tests');

      if (workspacesEnabled) {
        argv.push(`./packages/*/${DIR_PATTERN}`);
      }
    }
  });

  // Jest
  tool.on('jest.init-driver', (driver, argv) => {
    argv.push('--colors', '--logHeapUsage', '--detectOpenHandles');
  });

  // Prettier
  tool.on('prettier.init-driver', (driver, argv, { args }) => {
    argv.push('--write', './README.md');

    if (isEmptyArgs(args._, 'prettier')) {
      const exts = '{ts,tsx,js,jsx,scss,css,gql}';

      argv.push('./docs/**/*.md');

      if (workspacesEnabled) {
        argv.push(`./packages/*/${DIR_PATTERN}/**/*.${exts}`, './packages/*/*.{md,json}');
      } else {
        argv.push(`./${DIR_PATTERN}/**/*.${exts}`, './*.{md,json}');
      }
    }
  });

  // TypeScript
  tool.on('typescript.after-execute', () => {
    if (workspacesEnabled) {
      fs.copySync(
        path.join(tool.options.root, 'README.md'),
        path.join(tool.options.root, 'packages/core/README.md'),
      );
    }
  });
};
