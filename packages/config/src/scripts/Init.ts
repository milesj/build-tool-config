/* eslint-disable unicorn/no-unused-properties */

import fs from 'fs-extra';
import { Arguments, BeemoConfig, Script, ScriptContext } from '@beemo/core';
import { PackageStructure } from '@boost/common';
import { CJS_FOLDER, DTS_FOLDER, ESM_FOLDER } from '../constants';

export interface InitArgs {
  local?: boolean;
  node?: boolean;
  react?: boolean;
  workspaces?: boolean;
}

export default class InitScript extends Script<{}, InitArgs> {
  args() {
    return {
      boolean: ['local', 'node', 'react', 'workspaces'],
      default: {
        local: false,
        node: false,
        react: false,
        workspaces: false,
      },
    };
  }

  blueprint() {
    return {};
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
      ci: 'yarn run type && yarn run test && yarn run lint',
      release: 'npx np --yolo',

      // Building
      clean: 'packemon clean',
      build: 'packemon build --addEngines',
      pack: 'NODE_ENV=production packemon pack --addEngines --declaration=standard',

      // Testing
      coverage: 'yarn run test --coverage',
      test: 'beemo jest',

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
        release: 'lerna publish',
        type: 'beemo typescript --build --reference-workspaces',
      });
    } else {
      pkg.main = `./${CJS_FOLDER}/index.js`;
      pkg.module = `./${ESM_FOLDER}/index.js`;
      pkg.types = `./${DTS_FOLDER}/index.d.ts`;
      pkg.sideEffects = false;
    }

    // Save files
    const packagePath = context.cwd.append('package.json');
    const lernaPath = context.cwd.append('lerna.json');
    const promises = [fs.writeJSON(packagePath.path(), pkg, { spaces: 2 })];

    if (args.options.workspaces) {
      promises.push(
        fs.writeJSON(
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
}
