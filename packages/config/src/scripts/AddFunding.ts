import glob from 'fast-glob';
import fs from 'fs-extra';
import { PackageStructure, Script, ScriptContext } from '@beemo/core';

export default class AddFundingScript extends Script {
  async execute(context: ScriptContext) {
    const pkgPaths = await glob('**/package.json', {
      absolute: true,
      cwd: context.cwd.path(),
      ignore: ['**/node_modules'],
    });

    await Promise.all(
      pkgPaths.map(async (pkgPath) => {
        const pkg = (await fs.readJson(pkgPath)) as PackageStructure & { funding?: object };

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
