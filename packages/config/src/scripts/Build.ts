/* eslint-disable no-param-reassign */

import execa from 'execa';
import { Path, Script, ScriptContext } from '@beemo/core';

export default class BuildScript extends Script {
  workspaceArgs: string[] = [];

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

  determineArgs(context: ScriptContext) {
    const ignorePackages: string[] = [];
    const args = ['--silent'];

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

    this.workspaceArgs = args;
  }

  buildCjs(context: ScriptContext) {
    return this.handleResponse(
      execa('beemo', ['babel', '--clean', ...this.workspaceArgs], { preferLocal: true }),
    );
  }

  buildEsm(context: ScriptContext) {
    if (context.args.noEsm) {
      return Promise.resolve();
    }

    return this.handleResponse(
      execa('beemo', ['babel', '--clean', '--esm', ...this.workspaceArgs], {
        preferLocal: true,
      }),
    );
  }

  buildDeclarations(context: ScriptContext) {
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
