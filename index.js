const { EXTS, EXT_PATTERN, DIR_PATTERN } = require('./configs/constants');

module.exports = function milesj(tool) {
  const usingTypeScript = tool.config.drivers.includes('typescript');
  const usingWorkspaces = !!tool.package.workspaces;

  // Babel
  tool.on('babel.init-driver', (event, driver, args, { yargs }) => {
    args.push('--copy-files');

    if (usingTypeScript) {
      args.push('--typescript');

      if (!yargs.extensions) {
        args.push('--extensions', EXTS.join(','));
      }
    }

    if (yargs._.length === 0) {
      if (yargs.cjs) {
        args.push('./src', '--out-dir', './lib')
      } else if (yargs.esm) {
        args.push('./src', '--out-dir', './esm')
      }
    }
  });

  // ESLint
  tool.on('eslint.init-driver', (event, driver, args, { yargs }) => {
    args.push('--color', '--report-unused-disable-directives');

    if (usingTypeScript) {
      args.push('--typescript');

      if (!yargs.ext) {
        args.push('--ext', EXTS.join(','));
      }
    }

    if (yargs._.length === 0) {
      args.push('./src', './tests');

      if (usingWorkspaces) {
        args.push(`"./packages/*/${DIR_PATTERN}"`);
      }
    }
  });

  // Jest
  tool.on('jest.init-driver', (event, driver, args) => {
    args.push('--colors', '--logHeapUsage');

    if (usingWorkspaces) {
      args.push('--workspaces');
    }
  });

  // Prettier
  tool.on('prettier.init-driver', (event, driver, args) => {
    args.push('--write', './README.md');

    if (usingWorkspaces) {
      args.push(`"./packages/*/${DIR_PATTERN}/**/*.${EXT_PATTERN}"`, '"./packages/*/*.{md,json}"');
    } else {
      args.push(`"./${DIR_PATTERN}/**/*.${EXT_PATTERN}"`, '"./*.{md,json}"');
    }
  });
};
