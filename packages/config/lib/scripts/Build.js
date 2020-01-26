"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
const core_1 = require("@beemo/core");
class BuildScript extends core_1.Script {
    constructor() {
        super(...arguments);
        this.workspaceArgs = [];
    }
    args() {
        return {
            string: ['workspaces'],
            default: {
                workspaces: '',
            },
        };
    }
    blueprint() {
        return {};
    }
    bootstrap() {
        this.task('Determining workspace arguments', this.determineArgs);
        this.task('Building CommonJS files', this.buildCjs);
        this.task('Building ECMAScript module files', this.buildEsm);
        this.task('Generating TypeScript declarations', this.buildDeclarations);
    }
    determineArgs(context) {
        const ignorePackages = [];
        const args = ['--silent'];
        if (!context.args.workspaces) {
            return;
        }
        this.tool.getWorkspacePackages().forEach(pkg => {
            const srcPath = new core_1.Path(pkg.workspace.packagePath, 'src');
            if (!srcPath.exists()) {
                ignorePackages.push(pkg.name);
            }
        });
        args.push(`--workspaces=${ignorePackages.length > 0 ? `!(${ignorePackages.join('|')})` : '*'}`);
        this.workspaceArgs = args;
    }
    buildCjs() {
        return this.handleResponse(execa_1.default('beemo', ['babel', '--clean', ...this.workspaceArgs], { preferLocal: true }));
    }
    buildEsm(context) {
        if (context.args.noEsm) {
            return Promise.resolve();
        }
        return this.handleResponse(execa_1.default('beemo', ['babel', '--clean', '--esm', ...this.workspaceArgs], {
            preferLocal: true,
        }));
    }
    buildDeclarations(context) {
        if (context.args.workspaces || context.args.referenceWorkspaces || context.args.noDts) {
            return Promise.resolve();
        }
        return this.handleResponse(execa_1.default('beemo', ['typescript', '--declaration', '--emitDeclarationOnly'], {
            preferLocal: true,
        }));
    }
    handleResponse(promise) {
        return promise
            .then(response => {
            const out = response.stdout.trim();
            if (out) {
                console.log(out);
            }
            return response;
        })
            .catch(error => {
            console.error(error.message);
            throw error;
        });
    }
}
exports.default = BuildScript;
