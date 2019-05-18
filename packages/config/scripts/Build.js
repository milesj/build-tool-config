/* eslint-disable no-param-reassign */

const fs = require('fs');
const path = require('path');
const execa = require('execa');
const { Script } = require('@beemo/core');

module.exports = class BuildScript extends Script {
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

  determineArgs(context) {
    const ignorePackages = [];
    const args = ['--silent'];

    context.workspaceArgs = [];

    if (!context.args.workspaces) {
      return;
    }

    this.tool.getWorkspacePackages().forEach(pkg => {
      const srcPath = path.join(pkg.workspace.packagePath, 'src');

      if (!fs.existsSync(srcPath)) {
        ignorePackages.push(pkg.name);
      }
    });

    args.push(`--workspaces=${ignorePackages.length > 0 ? `!(${ignorePackages.join('|')})` : '*'}`);

    context.workspaceArgs = args;
  }

  buildCjs(context) {
    return this.handleResponse(execa('beemo', ['babel', '--clean', ...context.workspaceArgs]));
  }

  buildEsm(context) {
    if (context.args.noEsm) {
      return Promise.resolve();
    }

    return this.handleResponse(
      execa('beemo', ['babel', '--clean', '--esm', ...context.workspaceArgs]),
    );
  }

  buildDeclarations(context) {
    if (context.args.workspaces || context.args.referenceWorkspaces || context.args.noDts) {
      return Promise.resolve();
    }

    return this.handleResponse(
      execa('beemo', ['typescript', '--declaration', '--emitDeclarationOnly']),
    );
  }

  handleResponse(promise) {
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
};
