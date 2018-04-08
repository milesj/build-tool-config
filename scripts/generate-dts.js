const { Script } = require('@beemo/core');
const fs = require('fs-extra');
const path = require('path');
const generate = require('dts-generator').default;
const loadPackageWorkspaces = require('../utils/loadPackageWorkspaces');

module.exports = class GenerateDtsScript extends Script {
  parse() {
    return {
      default: {
        name: '',
      },
      string: ['name'],
    };
  }

  run(options, tool) {
    const { root } = tool.options;
    const { name, workspaces } = tool.package;

    if (workspaces) {
      return Promise.all(
        loadPackageWorkspaces(workspaces, root).map(({ packageData, workspacePath }) => {
          if (!fs.existsSync(path.join(workspacePath, 'tsconfig.json'))) {
            return Promise.resolve();
          }

          return this.generate(packageData.name, workspacePath);
        }),
      );
    }

    return this.generate(options.name || name, root);
  }

  generate(name, project) {
    return generate({
      files: './src/**/*.ts',
      indent: '  ',
      name: `${name}/lib`,
      out: 'index.d.ts',
      project,
      resolveModuleId({ currentModuleId }) {
        return currentModuleId === 'index' ? name : null;
      },
    });
  }
};
