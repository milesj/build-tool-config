import { DriverContext, Path, Tool } from '@beemo/core';
import { CJS_FOLDER, DIR_PATTERN, ESM_FOLDER, EXTS } from './constants';

const extsWithoutJSON = EXTS.filter((ext) => ext !== '.json');

function hasNoParams(context: DriverContext, name: string): boolean {
  const { params } = context.args;

  return params.length === 0 || (params.length === 1 && params[0] === name);
}

export default function milesOSS(tool: Tool) {
  const usingTypeScript = tool.driverRegistry.isRegistered('typescript');
  const workspacePrefixes = tool.project.getWorkspaceGlobs({ relative: true });

  // Babel
  tool.onRunDriver.listen((context) => {
    context.addOption('--copy-files');

    if (usingTypeScript && !context.getRiskyOption('extensions')) {
      context.addOption('--extensions', extsWithoutJSON.join(','));
    }

    if (hasNoParams(context, 'babel')) {
      context.addParam('src');
      context.addOption('--out-dir', context.getRiskyOption('esm') ? ESM_FOLDER : CJS_FOLDER);
    }
  }, 'babel');

  // ESLint
  tool.onRunDriver.listen((context) => {
    context.addOptions(['--color', '--fix']);

    if (usingTypeScript && !context.getRiskyOption('ext')) {
      context.addOption('--ext', extsWithoutJSON.join(','));
    }

    if (hasNoParams(context, 'eslint')) {
      if (workspacePrefixes.length > 0) {
        workspacePrefixes.forEach((wsPrefix) => {
          context.addParam(new Path(wsPrefix, DIR_PATTERN).path());
        });
      } else {
        context.addParams(['src', 'tests']);
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

    if (hasNoParams(context, 'prettier')) {
      const exts = '{ts,tsx,js,jsx,scss,css,gql,yml,yaml}';

      if (workspacePrefixes.length > 0) {
        workspacePrefixes.forEach((wsPrefix) => {
          context.addParams([
            new Path(wsPrefix, DIR_PATTERN, `**/*.${exts}`).path(),
            new Path(wsPrefix, '*.{md,json}').path(),
          ]);
        });
      } else {
        context.addParams([new Path(DIR_PATTERN, `**/*.${exts}`).path(), '*.{md,json}']);
      }
    }

    context.addParams(['docs/**/*.md', 'README.md']);
  }, 'prettier');
}
