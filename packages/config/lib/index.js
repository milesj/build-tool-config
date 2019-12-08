"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = __importDefault(require("fs-extra"));
var core_1 = require("@beemo/core");
var constants_1 = require("./constants");
var extsWithoutJSON = constants_1.EXTS.filter(function (ext) { return ext !== '.json'; });
function hasNoPositionalArgs(context, name) {
    var args = context.args._;
    return args.length === 0 || (args.length === 1 && args[0] === name);
}
module.exports = function milesOSS(tool) {
    var usingTypeScript = tool.isPluginEnabled('driver', 'typescript');
    var workspacePrefixes = tool.getWorkspacePaths({ relative: true });
    // Babel
    tool.onRunDriver.listen(function (context) {
        context.addOption('--copy-files');
        if (usingTypeScript && !context.args.extensions) {
            context.addOption('--extensions', extsWithoutJSON.join(','));
        }
        if (hasNoPositionalArgs(context, 'babel')) {
            context.addArg('src');
            context.addOption('--out-dir', context.args.esm ? constants_1.ESM_FOLDER : constants_1.CJS_FOLDER);
        }
    }, 'babel');
    // ESLint
    tool.onRunDriver.listen(function (context) {
        context.addOptions(['--color']);
        if (usingTypeScript && !context.args.ext) {
            context.addOption('--ext', extsWithoutJSON.join(','));
        }
        if (hasNoPositionalArgs(context, 'eslint')) {
            if (workspacePrefixes.length > 0) {
                workspacePrefixes.forEach(function (wsPrefix) {
                    context.addArg(new core_1.Path(wsPrefix, constants_1.DIR_PATTERN).path());
                });
            }
            else {
                context.addArgs(['src', 'tests']);
            }
        }
    }, 'eslint');
    // Jest
    tool.onRunDriver.listen(function (context, driver) {
        context.addOptions(['--colors', '--logHeapUsage']);
        if (context.argv.includes('--coverage')) {
            context.addOption('--detectOpenHandles');
        }
        driver.configure({
            env: {
                NODE_ENV: 'test',
                TZ: 'UTC',
            },
        });
    }, 'jest');
    // Prettier
    tool.onRunDriver.listen(function (context) {
        context.addOption('--write');
        if (hasNoPositionalArgs(context, 'prettier')) {
            var exts_1 = '{ts,tsx,js,jsx,scss,css,gql,yml,yaml}';
            if (workspacePrefixes.length > 0) {
                workspacePrefixes.forEach(function (wsPrefix) {
                    context.addArgs([
                        new core_1.Path(wsPrefix, constants_1.DIR_PATTERN, "**/*." + exts_1).path(),
                        new core_1.Path(wsPrefix, '*.{md,json}').path(),
                    ]);
                });
            }
            else {
                context.addArgs([new core_1.Path(constants_1.DIR_PATTERN, "**/*." + exts_1).path(), '*.{md,json}']);
            }
        }
        context.addArgs(['docs/**/*.md', 'README.md']);
    }, 'prettier');
    // TypeScript
    if (usingTypeScript && workspacePrefixes.length > 0) {
        tool.getPlugin('driver', 'typescript').onAfterExecute.listen(function () {
            var corePackage = core_1.Path.resolve('packages/core', tool.options.root);
            if (corePackage.exists()) {
                fs_extra_1.default.copySync(core_1.Path.resolve('README.md', tool.options.root).path(), corePackage.append('README.md').path());
            }
            return Promise.resolve();
        });
    }
};
