"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const core_1 = require("@beemo/core");
const constants_1 = require("../constants");
class InitScript extends core_1.Script {
    args() {
        return {
            boolean: ['local', 'node', 'react', 'workspaces'],
            default: {
                local: false,
                node: false,
                react: false,
                workspaces: false,
            },
        };
    }
    blueprint() {
        return {};
    }
    execute(context, args) {
        var _a;
        // @ts-expect-error
        const packageConfig = {
            ...this.tool.package,
            scripts: {},
        };
        // Beemo
        Object.assign(packageConfig.beemo, {
            module: args.local ? '@local' : '@milesj/build-tools',
            drivers: ['babel', 'eslint', 'jest', 'prettier', 'typescript'],
            settings: {},
        });
        if (args.node) {
            packageConfig.beemo.settings.node = true;
        }
        if (args.react) {
            packageConfig.beemo.settings.react = true;
        }
        // Scripts
        Object.assign(packageConfig.scripts, {
            prepare: 'beemo create-config --silent',
            build: 'beemo run-script build',
            coverage: 'yarn run jest --coverage',
            lint: 'beemo eslint',
            jest: 'beemo jest',
            prettier: 'beemo prettier',
            release: 'npx np --yolo --no-yarn',
            type: 'beemo typescript --noEmit',
            // Hooks
            prerelease: 'yarn test && yarn run build',
            pretest: 'yarn run type',
            test: 'yarn run jest',
            posttest: 'yarn run eslint',
        });
        if (args.workspaces) {
            if (!((_a = packageConfig.devDependencies) === null || _a === void 0 ? void 0 : _a.lerna)) {
                throw new Error(`Lerna must be installed to use workspaces.`);
            }
            if (!packageConfig.name.endsWith('-root')) {
                packageConfig.name += '-root';
            }
            if (!packageConfig.workspaces) {
                packageConfig.workspaces = ['packages/*'];
            }
            packageConfig.private = true;
            Object.assign(packageConfig.scripts, {
                build: 'beemo run-script build --workspaces=* && yarn run type --emitDeclarationOnly',
                release: 'lerna publish',
                type: 'beemo typescript --build --reference-workspaces',
            });
        }
        else {
            packageConfig.main = `./${constants_1.CJS_FOLDER}/index.js`;
            packageConfig.module = `./${constants_1.ESM_FOLDER}/index.js`;
            packageConfig.types = `./${constants_1.CJS_FOLDER}/index.d.ts`;
            packageConfig.sideEffects = false;
        }
        packageConfig.engines = { node: `>=${constants_1.MIN_NODE_VERSION}` };
        if (args.node) {
            packageConfig.scripts.build = packageConfig.scripts.type.replace('--noEmit', '').trim();
        }
        else {
            packageConfig.browserslist = [`ie ${constants_1.MIN_IE_VERSION}`];
        }
        // Save files
        const packagePath = this.tool.rootPath.append('package.json');
        const lernaPath = this.tool.rootPath.append('lerna.json');
        const promises = [fs_extra_1.default.writeJSON(packagePath.path(), packageConfig, { spaces: 2 })];
        if (args.workspaces) {
            promises.push(fs_extra_1.default.writeJSON(lernaPath.path(), {
                version: 'independent',
                npmClient: 'yarn',
                useWorkspaces: true,
                command: {
                    publish: {
                        ignoreChanges: ['*.md', '*.test.ts', '*.test.tsx'],
                    },
                },
            }, { spaces: 2 }));
        }
        return Promise.all(promises);
    }
}
exports.default = InitScript;
