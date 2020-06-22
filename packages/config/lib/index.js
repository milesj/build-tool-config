"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@beemo/core");
const constants_1 = require("./constants");
const extsWithoutJSON = constants_1.EXTS.filter((ext) => ext !== '.json');
function hasNoPositionalArgs(context, name) {
    const args = context.args._;
    return args.length === 0 || (args.length === 1 && args[0] === name);
}
module.exports = function milesOSS(tool) {
    const usingTypeScript = tool.isPluginEnabled('driver', 'typescript');
    const workspacePrefixes = tool.getWorkspacePaths({ relative: true });
    // Babel
    tool.onRunDriver.listen((context) => {
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
    tool.onRunDriver.listen((context) => {
        context.addOptions(['--color']);
        if (usingTypeScript && !context.args.ext) {
            context.addOption('--ext', extsWithoutJSON.join(','));
        }
        if (hasNoPositionalArgs(context, 'eslint')) {
            if (workspacePrefixes.length > 0) {
                workspacePrefixes.forEach((wsPrefix) => {
                    context.addArg(new core_1.Path(wsPrefix, constants_1.DIR_PATTERN).path());
                });
            }
            else {
                context.addArgs(['src', 'tests']);
            }
        }
    }, 'eslint');
    // Jest
    tool.onRunDriver.listen((context, driver) => {
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
    tool.onRunDriver.listen((context) => {
        context.addOption('--write');
        if (hasNoPositionalArgs(context, 'prettier')) {
            const exts = '{ts,tsx,js,jsx,scss,css,gql,yml,yaml}';
            if (workspacePrefixes.length > 0) {
                workspacePrefixes.forEach((wsPrefix) => {
                    context.addArgs([
                        new core_1.Path(wsPrefix, constants_1.DIR_PATTERN, `**/*.${exts}`).path(),
                        new core_1.Path(wsPrefix, '*.{md,json}').path(),
                    ]);
                });
            }
            else {
                context.addArgs([new core_1.Path(constants_1.DIR_PATTERN, `**/*.${exts}`).path(), '*.{md,json}']);
            }
        }
        context.addArgs(['docs/**/*.md', 'README.md']);
    }, 'prettier');
};
