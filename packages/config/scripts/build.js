/* eslint-disable sort-keys, import/no-extraneous-dependencies, no-param-reassign */

const { Script } = require('@beemo/core');
const fs = require('fs-extra');
const path = require('path');
const { CJS_FOLDER, ESM_FOLDER } = require('../configs/constants');

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

  execute(context, args) {
    return this.serializeTasks();
  }

  cleanTargets(context) {
    return Promise.all([
      fs.remove(path.join(context.root, CJS_FOLDER)),
      fs.remove(path.join(context.root, ESM_FOLDER)),
    ]);
  }

  buildCjs(context) {
    return this.executeCommand('yarn', ['beemo', 'babel'], {
      cwd: context.root,
    });
  }

  buildEsm(context) {
    return this.executeCommand('yarn', ['beemo', 'babel', '--esm'], {
      cwd: context.root,
    });
  }

  buildDeclarations(context) {
    return this.executeCommand(
      'yarn',
      ['beemo', 'typescript', '--declaration', '--emitDeclarationOnly'],
      {
        cwd: context.root,
      },
    );
  }
};
