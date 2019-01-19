const { Script } = require('@beemo/core');
const fs = require('fs-extra');
const path = require('path');
const { CJS_FOLDER, ESM_FOLDER } = require('../constants');

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
    this.task('Cleaning target folders', this.cleanTargets);
    this.task('Building CommonJS files', this.buildCjs);
    this.task('Building EcmaScript module files', this.buildEsm);
    this.task('Generating TypeScript declartions', this.buildDeclarations);
  }

  execute() {
    return this.serializeTasks();
  }

  cleanTargets(context) {
    return Promise.all([
      fs.remove(path.join(context.root, CJS_FOLDER)),
      fs.remove(path.join(context.root, ESM_FOLDER)),
    ]);
  }

  buildCjs(context) {
    return this.executeCommand('beemo', ['babel'], {
      cwd: context.root,
    });
  }

  buildEsm(context) {
    return this.executeCommand('beemo', ['babel', '--esm'], {
      cwd: context.root,
    });
  }

  buildDeclarations(context) {
    return this.executeCommand('beemo', ['typescript', '--declaration', '--emitDeclarationOnly'], {
      cwd: context.root,
    });
  }
};
