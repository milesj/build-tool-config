const fs = require('fs-extra');
const glob = require('fast-glob');
const { Script } = require('@beemo/core');

module.exports = class AddFundingScript extends Script {
  args() {
    return {};
  }

  blueprint() {
    return {};
  }

  bootstrap() {
    this.task('Add funding to all package.json', this.addFundingToPackages);
  }

  addFundingToPackages(context) {
    return glob('**/package.json', {
      absolute: true,
      cwd: context.cwd,
      ignore: ['**/node_modules'],
    }).then(pkgPaths =>
      pkgPaths.map(pkgPath => {
        const pkg = fs.readJsonSync(pkgPath);

        if (!pkg.private) {
          pkg.funding = {
            type: 'ko-fi',
            url: 'https://ko-fi.com/milesjohnson',
          };
        }

        return fs.writeJson(pkgPath, pkg, { spaces: 2 });
      }),
    );
  }
};
