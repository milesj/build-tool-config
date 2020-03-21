"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const core_1 = require("@beemo/core");
class AddFundingScript extends core_1.Script {
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
        return fast_glob_1.default('**/package.json', {
            absolute: true,
            cwd: context.cwd.path(),
            ignore: ['**/node_modules'],
        }).then((pkgPaths) => pkgPaths.map((pkgPath) => {
            const pkg = fs_extra_1.default.readJsonSync(pkgPath);
            if (!pkg.private) {
                pkg.funding = {
                    type: 'ko-fi',
                    url: 'https://ko-fi.com/milesjohnson',
                };
            }
            return fs_extra_1.default.writeJson(pkgPath, pkg, { spaces: 2 });
        }));
    }
}
exports.default = AddFundingScript;
