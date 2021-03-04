import fs from 'fs-extra';
import { Arguments, BeemoConfig, ParserOptions, Script, ScriptContext } from '@beemo/core';
import { PackageStructure } from '@boost/common';
import { CJS_FOLDER, DTS_FOLDER, ESM_FOLDER } from '../constants';

export interface InitArgs {
  local?: boolean;
  node?: boolean;
  react?: boolean;
  workspaces?: boolean;
}

class InitScript extends Script<{}, InitArgs> {
  readonly name = '@milesj/beemo-script-init';

  parse(): ParserOptions<InitArgs> {
    return {
      options: {
        local: {
          description: 'Initialize with an @local config module',
          type: 'boolean',
        },
        node: {
          description: 'Project is Node.js only',
          type: 'boolean',
        },
        react: {
          description: 'Project will be using React',
          type: 'boolean',
        },
        workspaces: {
          description: 'Initialize project as a monorepo using workspaces',
          type: 'boolean',
        },
      },
    };
  }

  execute(context: ScriptContext, args: Arguments<InitArgs>) {
    const pkg: PackageStructure = {
      ...this.tool.package,
      scripts: {},
    };

    const config: BeemoConfig = {
      module: args.options.local ? '@local' : '@milesj/build-tools',
      drivers: ['babel', 'eslint', 'jest', 'prettier', 'typescript'],
      settings: {},
    };

    if (args.options.node) {
      config.settings!.node = true;
    }

    if (args.options.react) {
      config.settings!.react = true;
    }

    // Scripts
    Object.assign(pkg.scripts, {
      prepare: 'beemo create-config --silent',
      check: 'yarn run type && yarn run test && yarn run lint',
      release: 'npx np --yolo',

      // Building
      clean: 'packemon clean',
      build: 'packemon build --addEngines',
      pack: 'NODE_ENV=production packemon pack --addEngines --declaration=standard',

      // Testing
      test: 'beemo jest',
      coverage: 'yarn run test --coverage',

      // Other
      format: 'beemo prettier',
      lint: 'beemo eslint',
      type: 'beemo typescript --noEmit',

      // Hooks
      prerelease: 'yarn run pack && yarn run ci',
    });

    if (args.options.workspaces) {
      if (!pkg.devDependencies?.lerna) {
        throw new Error(`Lerna must be installed to use workspaces.`);
      }

      if (!pkg.name.endsWith('-root')) {
        pkg.name += '-root';
      }

      if (!pkg.workspaces) {
        pkg.workspaces = ['packages/*'];
      }

      pkg.private = true;

      Object.assign(pkg.scripts, {
        release:
          'lerna version --conventional-commits --changelog-preset conventional-changelog-beemo --create-release github --push && lerna publish from-git',
        type: 'beemo typescript --build --reference-workspaces',
      });
    } else {
      pkg.main = `./${CJS_FOLDER}/index.js`;
      pkg.module = `./${ESM_FOLDER}/index.js`;
      pkg.types = `./${DTS_FOLDER}/index.d.ts`;
      pkg.sideEffects = false;
      pkg.funding = {
        type: 'ko-fi',
        url: 'https://ko-fi.com/milesjohnson',
      };
    }

    // Sort scripts
    pkg.scripts = this.sortObject(pkg.scripts!);

    // Save files
    const beemoPath = context.cwd.append('.config/beemo.ts');
    const packagePath = context.cwd.append('package.json');
    const lernaPath = context.cwd.append('lerna.json');
    const promises = [
      fs.writeJson(packagePath.path(), pkg, { spaces: 2 }),
      fs.writeFile(beemoPath.path(), `export default ${JSON.stringify(config)};`, 'utf8'),
    ];

    if (args.options.workspaces) {
      promises.push(
        fs.writeJson(
          lernaPath.path(),
          {
            version: 'independent',
            npmClient: 'yarn',
            useWorkspaces: true,
            command: {
              publish: {
                ignoreChanges: ['*.md', '*.test.ts', '*.test.tsx'],
              },
            },
          },
          { spaces: 2 },
        ),
      );
    }

    return Promise.all(promises);
  }

  protected sortObject(object: Record<string, string>): Record<string, string> {
    const entries = Object.entries(object).sort((a, b) => a[0].localeCompare(b[0]));

    return Object.fromEntries(entries);
  }
}

export default function init() {
  return new InitScript();
}
