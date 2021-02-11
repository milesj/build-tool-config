import Beemo, { DriverContext, Path } from '@beemo/core';
import { CJS_FOLDER, DIR_PATTERN, ESM_FOLDER, EXTS } from './constants';

const extsWithoutJSON = EXTS.filter((ext) => ext !== '.json');

function hasNoPositionalArgs(context: DriverContext, name: string): boolean {
  const args = (context.args.params || context.args._) as string[];

  return args.length === 0 || (args.length === 1 && args[0] === name);
}

module.exports = function milesOSS(tool: Beemo) {
  const usingTypeScript = tool.isPluginEnabled('driver', 'typescript');
  const workspacePrefixes = tool.getWorkspacePaths({ relative: true });

  // Babel
  tool.onRunDriver.listen((context) => {
    context.addOption('--copy-files');

    if (usingTypeScript && !context.args.extensions) {
      context.addOption('--extensions', extsWithoutJSON.join(','));
    }

    if (hasNoPositionalArgs(context, 'babel')) {
      context.addArg('src');
      context.addOption('--out-dir', context.args.esm ? ESM_FOLDER : CJS_FOLDER);
    }
  }, 'babel');

  // ESLint
  tool.onRunDriver.listen((context) => {
    context.addOptions(['--color', '--fix']);

    if (usingTypeScript && !context.args.ext) {
      context.addOption('--ext', extsWithoutJSON.join(','));
    }

    if (hasNoPositionalArgs(context, 'eslint')) {
      if (workspacePrefixes.length > 0) {
        workspacePrefixes.forEach((wsPrefix) => {
          context.addArg(new Path(wsPrefix, DIR_PATTERN).path());
        });
      } else {
        context.addArgs(['src', 'tests']);
      }
    }
  }, 'eslint');

  // Jest
  tool.onRunDriver.listen((context, driver) => {
    context.addOptions(['--colors', '--logHeapUsage']);

    if (context.argv.includes('--coverage')) {
      context.addOption('--detectOpenHandles');
    }

    driver.configure({
      env: {
        NODE_ENV: 'test',
        TZ: 'UTC',
      },
    });
  }, 'jest');

  // Prettier
  tool.onRunDriver.listen((context) => {
    context.addOption('--write');

    if (hasNoPositionalArgs(context, 'prettier')) {
      const exts = '{ts,tsx,js,jsx,scss,css,gql,yml,yaml}';

      if (workspacePrefixes.length > 0) {
        workspacePrefixes.forEach((wsPrefix) => {
          context.addArgs([
            new Path(wsPrefix, DIR_PATTERN, `**/*.${exts}`).path(),
            new Path(wsPrefix, '*.{md,json}').path(),
          ]);
        });
      } else {
        context.addArgs([new Path(DIR_PATTERN, `**/*.${exts}`).path(), '*.{md,json}']);
      }
    }

    context.addArgs(['docs/**/*.md', 'README.md']);
  }, 'prettier');
};
