const fs = require('fs-extra');
const path = require('path');
const { EXTS, DIR_PATTERN } = require('./configs/constants');

const extsWithoutJSON = EXTS.filter(ext => ext !== '.json');

function hasNoPositionalArgs(context, name) {
  const args = context.args._;

  return args.length === 0 || (args.length === 1 && args[0] === name);
}

module.exports = function milesj(tool) {
  const usingTypeScript = tool.config.drivers.includes('typescript');
  const workspacesEnabled = !!tool.package.workspaces;

  // Babel
  tool.on('babel.init-driver', (driver, context) => {
    context.addOption('--copy-files');

    if (usingTypeScript && !context.args.extensions) {
      context.addOption('--extensions', extsWithoutJSON.join(','));
    }

    if (hasNoPositionalArgs(context, 'babel')) {
      context.addArg('./src');
      context.addOption('--out-dir', context.args.esm ? './esm' : './lib');
    }
  });

  // ESLint
  tool.on('eslint.init-driver', (driver, context) => {
    context.addOptions(['--color', '--report-unused-disable-directives']);

    if (usingTypeScript && !context.args.ext) {
      context.addOption('--ext', extsWithoutJSON.join(','));
    }

    if (hasNoPositionalArgs(context, 'eslint')) {
      context.addArgs(['./src', './tests']);

      if (workspacesEnabled) {
        context.addArg(`./packages/*/${DIR_PATTERN}`);
      }
    }
  });

  // Jest
  tool.on('jest.init-driver', (driver, context) => {
    context.addOptions(['--colors', '--logHeapUsage', '--detectOpenHandles']);
  });

  // Prettier
  tool.on('prettier.init-driver', (driver, context) => {
    context.addOption('--write');

    if (hasNoPositionalArgs(context, 'prettier')) {
      const exts = '{ts,tsx,js,jsx,scss,css,gql}';

      if (workspacesEnabled) {
        context.addArgs([`./packages/*/${DIR_PATTERN}/**/*.${exts}`, './packages/*/*.{md,json}']);
      } else {
        context.addArgs([`./${DIR_PATTERN}/**/*.${exts}`, './*.{md,json}']);
      }
    }

    context.addArgs(['./README.md', './docs/**/*.md']);
  });

  // TypeScript
  if (workspacesEnabled) {
    tool.on('typescript.after-execute', () => {
      fs.copySync(
        path.join(tool.options.root, 'README.md'),
        path.join(tool.options.root, 'packages/core/README.md'),
      );
    });
  }
};
