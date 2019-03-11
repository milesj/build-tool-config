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

  bootstrap() {
    this.task('Determining workspace arguments', this.determineArgs);
    this.task('Building CommonJS files', this.buildCjs);
    this.task('Building ECMAScript module files', this.buildEsm);
    this.task('Generating TypeScript declarations', this.buildDeclarations);
  }

  determineArgs(context) {
    const ignorePackages = [];
    const args = ['--silent'];

    if (!context.args.workspaces) {
      return args;
    }

    this.tool.getWorkspacePackages().forEach(pkg => {
      const srcPath = path.join(pkg.workspace.packagePath, 'src');

      if (!fs.existsSync(srcPath)) {
        ignorePackages.push(pkg.name);
      }
    });

    const glob = ignorePackages.length > 0 ? `!(${ignorePackages.join('|')})` : '*';

    args.push(`--workspaces=${glob}`);

    return args;
  }

  buildCjs(context, extraArgs) {
    return this.handleResponse(
      execa('beemo', ['babel', '--clean', ...extraArgs], { cwd: context.cwd }),
      extraArgs,
    );
  }

  buildEsm(context, extraArgs) {
    return this.handleResponse(
      execa('beemo', ['babel', '--clean', '--esm', ...extraArgs], { cwd: context.cwd }),
      extraArgs,
    );
  }

  buildDeclarations(context, extraArgs) {
    return this.handleResponse(
      execa('beemo', ['typescript', '--declaration', '--emitDeclarationOnly', ...extraArgs], {
        cwd: context.cwd,
      }),
      extraArgs,
    );
  }

  handleResponse(promise, extraArgs) {
    return promise
      .then(response => {
        const out = response.stdout.trim();

        if (out) {
          this.tool.log(out);
        }

        return extraArgs;
      })
      .catch(error => {
        this.tool.logError(error.message);

        throw error;
      });
  }
};
