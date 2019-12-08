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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var execa_1 = __importDefault(require("execa"));
var core_1 = require("@beemo/core");
var BuildScript = /** @class */ (function (_super) {
    __extends(BuildScript, _super);
    function BuildScript() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        Object.defineProperty(_this, "workspaceArgs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        return _this;
    }
    Object.defineProperty(BuildScript.prototype, "args", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return {
                string: ['workspaces'],
                default: {
                    workspaces: '',
                },
            };
        }
    });
    Object.defineProperty(BuildScript.prototype, "blueprint", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return {};
        }
    });
    Object.defineProperty(BuildScript.prototype, "bootstrap", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            this.task('Determining workspace arguments', this.determineArgs);
            this.task('Building CommonJS files', this.buildCjs);
            this.task('Building ECMAScript module files', this.buildEsm);
            this.task('Generating TypeScript declarations', this.buildDeclarations);
        }
    });
    Object.defineProperty(BuildScript.prototype, "determineArgs", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (context) {
            var ignorePackages = [];
            var args = ['--silent'];
            if (!context.args.workspaces) {
                return;
            }
            this.tool.getWorkspacePackages().forEach(function (pkg) {
                var srcPath = new core_1.Path(pkg.workspace.packagePath, 'src');
                if (!srcPath.exists()) {
                    ignorePackages.push(pkg.name);
                }
            });
            args.push("--workspaces=" + (ignorePackages.length > 0 ? "!(" + ignorePackages.join('|') + ")" : '*'));
            this.workspaceArgs = args;
        }
    });
    Object.defineProperty(BuildScript.prototype, "buildCjs", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (context) {
            return this.handleResponse(execa_1.default('beemo', __spreadArrays(['babel', '--clean'], this.workspaceArgs), { preferLocal: true }));
        }
    });
    Object.defineProperty(BuildScript.prototype, "buildEsm", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (context) {
            if (context.args.noEsm) {
                return Promise.resolve();
            }
            return this.handleResponse(execa_1.default('beemo', __spreadArrays(['babel', '--clean', '--esm'], this.workspaceArgs), {
                preferLocal: true,
            }));
        }
    });
    Object.defineProperty(BuildScript.prototype, "buildDeclarations", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (context) {
            if (context.args.workspaces || context.args.referenceWorkspaces || context.args.noDts) {
                return Promise.resolve();
            }
            return this.handleResponse(execa_1.default('beemo', ['typescript', '--declaration', '--emitDeclarationOnly'], {
                preferLocal: true,
            }));
        }
    });
    Object.defineProperty(BuildScript.prototype, "handleResponse", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (promise) {
            return promise
                .then(function (response) {
                var out = response.stdout.trim();
                if (out) {
                    console.log(out);
                }
                return response;
            })
                .catch(function (error) {
                console.error(error.message);
                throw error;
            });
        }
    });
    return BuildScript;
}(core_1.Script));
exports.default = BuildScript;
