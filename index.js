const { EXTS, EXT_PATTERN, DIR_PATTERN } = require('./configs/constants');

const extsWithoutJSON = EXTS.filter(ext => ext !== '.json');

function isEmptyArgs(args, name) {
  return args.length === 0 || (args.length === 1 && args[0] === name);
}

module.exports = function milesj(tool) {
  const usingTypeScript = tool.config.drivers.includes('typescript');
  const usingWorkspaces = !!tool.package.workspaces;

  // Babel
  tool.on('babel.init-driver', (driver, argv, { args }) => {
    argv.push('--copy-files');

    if (usingTypeScript) {
      argv.push('--typescript');

      if (!args.extensions) {
        argv.push('--extensions', extsWithoutJSON.join(','));
      }
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

    if (usingTypeScript) {
      argv.push('--typescript');

      if (!args.ext) {
        argv.push('--ext', extsWithoutJSON.join(','));
      }
    }

    if (isEmptyArgs(args._, 'eslint')) {
      argv.push('./src', './tests');

      if (usingWorkspaces) {
        argv.push(`./packages/*/${DIR_PATTERN}`);
      }
    }
  });

  // Jest
  tool.on('jest.init-driver', (driver, argv) => {
    argv.push('--colors', '--logHeapUsage');
  });

  // Prettier
  tool.on('prettier.init-driver', (driver, argv) => {
    argv.push('--write', './README.md');

    if (usingWorkspaces) {
      argv.push(`./packages/*/${DIR_PATTERN}/**/*.${EXT_PATTERN}`, './packages/*/*.{md,json}');
    } else {
      argv.push(`./${DIR_PATTERN}/**/*.${EXT_PATTERN}`, './*.{md,json}');
    }
  });
};
