import glob from 'fast-glob';
import fs from 'fs-extra';
import { Script, ScriptContext } from '@beemo/core';
import { PackageConfig } from '@boost/core';

export default class AddFundingScript extends Script {
  args() {
    return {};
  }

  blueprint() {
    return {};
  }

  bootstrap() {
    this.task('Add funding to all package.json', this.addFundingToPackages);
  }

  addFundingToPackages(context: ScriptContext) {
    return glob('**/package.json', {
      absolute: true,
      cwd: context.cwd.path(),
      ignore: ['**/node_modules'],
    }).then((pkgPaths) =>
      pkgPaths.map((pkgPath) => {
        const pkg = fs.readJsonSync(pkgPath) as PackageConfig & { funding?: object };

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
}
