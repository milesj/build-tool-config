import fs from 'fs-extra';
import { PackageConfig } from '@boost/core';
import { Script, ScriptContext, BeemoConfig } from '@beemo/core';
import { CJS_FOLDER, ESM_FOLDER, MIN_IE_VERSION, MIN_NODE_VERSION } from '../constants';
import { Settings } from '../types';

export interface InitArgs {
  local?: boolean;
  node?: boolean;
  react?: boolean;
  workspaces?: boolean;
}

export interface BeemoPackageConfig {
  beemo: BeemoConfig<Settings>;
  types?: string;
  browserslist?: string[];
  workspaces?: string[];
}

export default class InitScript extends Script<InitArgs> {
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

  execute(context: ScriptContext, args: InitArgs) {
    // @ts-expect-error
    const packageConfig: PackageConfig & BeemoPackageConfig = {
      ...this.tool.package,
      scripts: {},
    };

    // Beemo
    Object.assign(packageConfig.beemo, {
      module: args.local ? '@local' : '@milesj/build-tools',
      drivers: ['babel', 'eslint', 'jest', 'prettier', 'typescript'],
      settings: {},
    });

    if (args.node) {
      packageConfig.beemo.settings.node = true;
    }

    if (args.react) {
      packageConfig.beemo.settings.react = true;
    }

    // Scripts
    Object.assign(packageConfig.scripts, {
      prepare: 'beemo create-config --silent',
      build: 'beemo run-script build',
      ci: 'yarn run type && yarn run test && yarn run lint',
      coverage: 'yarn run test --coverage',
      format: 'beemo prettier',
      lint: 'beemo eslint',
      release: 'npx np --yolo',
      test: 'beemo jest',
      type: 'beemo typescript --noEmit',

      // Hooks
      prerelease: 'yarn run ci && yarn run build',
    });

    if (args.workspaces) {
      if (!packageConfig.devDependencies?.lerna) {
        throw new Error(`Lerna must be installed to use workspaces.`);
      }

      if (!packageConfig.name.endsWith('-root')) {
        packageConfig.name += '-root';
      }

      if (!packageConfig.workspaces) {
        packageConfig.workspaces = ['packages/*'];
      }

      packageConfig.private = true;

      Object.assign(packageConfig.scripts, {
        build: 'beemo run-script build --workspaces=* && yarn run type --emitDeclarationOnly',
        release: 'lerna publish',
        type: 'beemo typescript --build --reference-workspaces',
      });
    } else {
      packageConfig.main = `./${CJS_FOLDER}/index.js`;
      packageConfig.module = `./${ESM_FOLDER}/index.js`;
      packageConfig.types = `./${CJS_FOLDER}/index.d.ts`;
      packageConfig.sideEffects = false;
    }

    packageConfig.engines = { node: `>=${MIN_NODE_VERSION}` };

    if (args.node) {
      packageConfig.scripts!.build = packageConfig.scripts!.type.replace('--noEmit', '').trim();
    } else {
      packageConfig.browserslist = [`ie ${MIN_IE_VERSION}`];
    }

    // Save files
    const packagePath = this.tool.rootPath.append('package.json');
    const lernaPath = this.tool.rootPath.append('lerna.json');
    const promises = [fs.writeJSON(packagePath.path(), packageConfig, { spaces: 2 })];

    if (args.workspaces) {
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
