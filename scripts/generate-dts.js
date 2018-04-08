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
      return loadPackageWorkspaces(workspaces, root).then(packages =>
        Promise.all(
          packages.map(({ packageData, workspacePath }) => {
            if (!fs.existsSync(path.join(workspacePath, 'tsconfig.json'))) {
              return Promise.resolve();
            }

            return this.generate(packageData.name, workspacePath);
          }),
        ),
      );
    }

    return this.generate(options.name || name, root);
  }

  generate(name, project) {
    return generate({
      files: './src/**/*.ts',
      indent: '  ',
      name,
      out: `${project}/index.d.ts`,
      project,
      resolveModuleId: ({ currentModuleId }) => {
        if (currentModuleId.includes('node_modules')) {
          return currentModuleId;
        }

        return this.resolveModulePath(currentModuleId, name);
      },
      resolveModuleImport: ({ importedModuleId, currentModuleId }) => {
        if (importedModuleId.charAt(0) !== '.') {
          return importedModuleId;
        }

        return this.resolveModulePath(
          path.join(path.dirname(currentModuleId), importedModuleId),
          name,
        );
      },
    });
  }

  resolveModulePath(modPath, name) {
    const id = modPath.includes('/src/') ? modPath.split('/src/')[1] : modPath;

    return id === 'index' ? name : `${name}/lib/${id}`;
  }
};
