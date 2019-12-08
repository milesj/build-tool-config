import fs from 'fs-extra';
import Beemo, { Path, DriverContext } from '@beemo/core';
import { EXTS, DIR_PATTERN, CJS_FOLDER, ESM_FOLDER } from './constants';

const extsWithoutJSON = EXTS.filter(ext => ext !== '.json');

function hasNoPositionalArgs(context: DriverContext, name: string): boolean {
  const args = context.args._;

  return args.length === 0 || (args.length === 1 && args[0] === name);
}

module.exports = function milesOSS(tool: Beemo) {
  const usingTypeScript = tool.isPluginEnabled('driver', 'typescript');
  const workspacePrefixes = tool.getWorkspacePaths({ relative: true });

  // Babel
  tool.onRunDriver.listen(context => {
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
  tool.onRunDriver.listen(context => {
    context.addOptions(['--color']);

    if (usingTypeScript && !context.args.ext) {
      context.addOption('--ext', extsWithoutJSON.join(','));
    }

    if (hasNoPositionalArgs(context, 'eslint')) {
      if (workspacePrefixes.length > 0) {
        workspacePrefixes.forEach(wsPrefix => {
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
  tool.onRunDriver.listen(context => {
    context.addOption('--write');

    if (hasNoPositionalArgs(context, 'prettier')) {
      const exts = '{ts,tsx,js,jsx,scss,css,gql,yml,yaml}';

      if (workspacePrefixes.length > 0) {
        workspacePrefixes.forEach(wsPrefix => {
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

  // TypeScript
  if (usingTypeScript && workspacePrefixes.length > 0) {
    tool.getPlugin('driver', 'typescript').onAfterExecute.listen(() => {
      const corePackage = Path.resolve('packages/core', tool.options.root);

      if (corePackage.exists()) {
        fs.copySync(
          Path.resolve('README.md', tool.options.root).path(),
          corePackage.append('README.md').path(),
        );
      }

      return Promise.resolve();
    });
  }
};
