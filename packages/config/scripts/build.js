const { Script } = require('@beemo/core');

module.exports = class BuildScript extends Script {
  bootstrap() {
    this.task('Building CommonJS files', this.buildCjs);
    this.task('Building EcmaScript module files', this.buildEsm);
    this.task('Generating TypeScript declartions', this.buildDeclarations);
  }

  buildCjs(context) {
    return this.handleResponse(
      this.executeCommand('beemo', ['babel', '--workspaces=*', '--clean'], {
        cwd: context.root,
      }),
    );
  }

  buildEsm(context) {
    return this.handleResponse(
      this.executeCommand('beemo', ['babel', '--workspaces=*', '--clean', '--esm'], {
        cwd: context.root,
      }),
    );
  }

  buildDeclarations(context) {
    return this.handleResponse(
      this.executeCommand(
        'beemo',
        ['typescript', '--workspaces=*', '--declaration', '--emitDeclarationOnly'],
        {
          cwd: context.root,
        },
      ),
    );
  }

  handleResponse(promise) {
    return promise
      .then(response => {
        this.tool.log(response.stdout);

        return response;
      })
      .catch(error => {
        this.tool.logError(error.message);

        throw error;
      });
  }
};
