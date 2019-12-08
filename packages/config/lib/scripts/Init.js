"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = __importDefault(require("fs-extra"));
var core_1 = require("@beemo/core");
var constants_1 = require("../constants");
var InitScript = /** @class */ (function (_super) {
    __extends(InitScript, _super);
    function InitScript() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(InitScript.prototype, "args", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
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
    });
    Object.defineProperty(InitScript.prototype, "blueprint", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return {};
        }
    });
    Object.defineProperty(InitScript.prototype, "execute", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (context, args) {
            var _a;
            var packageConfig = __assign(__assign({ beemo: {
                    settings: {},
                } }, this.tool.package), { scripts: {} });
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
                eslint: 'beemo eslint',
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
                    throw new Error("Lerna must be installed to use workspaces.");
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
                packageConfig.main = "./" + constants_1.CJS_FOLDER + "/index.js";
                packageConfig.module = "./" + constants_1.ESM_FOLDER + "/index.js";
                packageConfig.types = "./" + constants_1.CJS_FOLDER + "/index.d.ts";
                packageConfig.sideEffects = false;
            }
            if (args.node) {
                packageConfig.scripts.build = packageConfig.scripts.type.replace('--noEmit', '').trim();
                packageConfig.engines = { node: ">=" + constants_1.MIN_NODE_VERSION };
            }
            else {
                packageConfig.browserslist = ["ie " + constants_1.MIN_IE_VERSION];
            }
            // Save files
            var packagePath = this.tool.rootPath.append('package.json');
            var lernaPath = this.tool.rootPath.append('lerna.json');
            var promises = [fs_extra_1.default.writeJSON(packagePath.path(), packageConfig, { spaces: 2 })];
            if (args.workspaces) {
                promises.push(fs_extra_1.default.writeJSON(lernaPath.path(), {
                    version: 'independent',
                    npmClient: 'yarn',
                    useWorkspaces: true,
                    command: {
                        publish: {
                            ignoreChanges: ['*.md'],
                        },
                    },
                }, { spaces: 2 }));
            }
            return Promise.all(promises);
        }
    });
    return InitScript;
}(core_1.Script));
exports.default = InitScript;
