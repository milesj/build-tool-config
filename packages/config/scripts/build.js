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
    this.task('Filtering workspaces', this.filterWorkspaces);
    this.task('Building CommonJS files', this.buildCjs);
    this.task('Building EcmaScript module files', this.buildEsm);
    this.task('Generating TypeScript declarations', this.buildDeclarations);
  }

  filterWorkspaces() {
    const ignorePackages = [];

    this.tool.getWorkspacePackages().forEach(pkg => {
      const srcPath = path.join(pkg.workspace.packagePath, 'src');

      if (!fs.existsSync(srcPath)) {
        ignorePackages.push(pkg.name);
      }
    });

    return ignorePackages.length > 0 ? `!(${ignorePackages.join('|')})` : '*';
  }

  buildCjs(context, wsGlob) {
    return execa('beemo', ['babel', `--workspaces=${wsGlob}`, '--clean'])
      .then(response => {
        this.tool.log(response.stdout);

        return wsGlob;
      })
      .catch(error => {
        this.tool.logError(error.message);

        throw error;
      });
  }

  buildEsm(context, wsGlob) {
    return execa('beemo', ['babel', `--workspaces=${wsGlob}`, '--clean', '--esm'])
      .then(response => {
        this.tool.log(response.stdout);

        return wsGlob;
      })
      .catch(error => {
        this.tool.logError(error.message);

        throw error;
      });
  }

  buildDeclarations(context, wsGlob) {
    return execa('beemo', [
      'typescript',
      `--workspaces=${wsGlob}`,
      '--declaration',
      '--emitDeclarationOnly',
    ])
      .then(response => {
        this.tool.log(response.stdout);

        return wsGlob;
      })
      .catch(error => {
        this.tool.logError(error.message);

        throw error;
      });
  }
};
