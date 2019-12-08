/* eslint-disable no-param-reassign */

import execa from 'execa';
import { Path, Script, ScriptContext } from '@beemo/core';

export interface BuildContext extends ScriptContext {
  workspaceArgs: string[];
}

export default class BuildScript extends Script {
  args() {
    return {
      string: ['workspaces'],
      default: {
        workspaces: '',
      },
    };
  }

  blueprint() {
    return {};
  }

  bootstrap() {
    this.task('Determining workspace arguments', this.determineArgs);
    this.task('Building CommonJS files', this.buildCjs);
    this.task('Building ECMAScript module files', this.buildEsm);
    this.task('Generating TypeScript declarations', this.buildDeclarations);
  }

  determineArgs(context: BuildContext) {
    const ignorePackages = [];
    const args = ['--silent'];

    context.workspaceArgs = [];

    if (!context.args.workspaces) {
      return;
    }

    this.tool.getWorkspacePackages().forEach(pkg => {
      const srcPath = new Path(pkg.workspace.packagePath, 'src');

      if (!srcPath.exists()) {
        ignorePackages.push(pkg.name);
      }
    });

    args.push(`--workspaces=${ignorePackages.length > 0 ? `!(${ignorePackages.join('|')})` : '*'}`);

    context.workspaceArgs = args;
  }

  buildCjs(context: BuildContext) {
    return this.handleResponse(
      execa('beemo', ['babel', '--clean', ...context.workspaceArgs], { preferLocal: true }),
    );
  }

  buildEsm(context: BuildContext) {
    if (context.args.noEsm) {
      return Promise.resolve();
    }

    return this.handleResponse(
      execa('beemo', ['babel', '--clean', '--esm', ...context.workspaceArgs], {
        preferLocal: true,
      }),
    );
  }

  buildDeclarations(context: BuildContext) {
    if (context.args.workspaces || context.args.referenceWorkspaces || context.args.noDts) {
      return Promise.resolve();
    }

    return this.handleResponse(
      execa('beemo', ['typescript', '--declaration', '--emitDeclarationOnly'], {
        preferLocal: true,
      }),
    );
  }

  handleResponse(promise: Promise<execa.ExecaReturnValue>): Promise<execa.ExecaReturnValue> {
    return promise
      .then(response => {
        const out = response.stdout.trim();

        if (out) {
          console.log(out);
        }

        return response;
      })
      .catch(error => {
        console.error(error.message);

        throw error;
      });
  }
}
