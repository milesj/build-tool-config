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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = __importDefault(require("fs-extra"));
var fast_glob_1 = __importDefault(require("fast-glob"));
var core_1 = require("@beemo/core");
var AddFundingScript = /** @class */ (function (_super) {
    __extends(AddFundingScript, _super);
    function AddFundingScript() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(AddFundingScript.prototype, "args", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return {};
        }
    });
    Object.defineProperty(AddFundingScript.prototype, "blueprint", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return {};
        }
    });
    Object.defineProperty(AddFundingScript.prototype, "bootstrap", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            this.task('Add funding to all package.json', this.addFundingToPackages);
        }
    });
    Object.defineProperty(AddFundingScript.prototype, "addFundingToPackages", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (context) {
            return fast_glob_1.default('**/package.json', {
                absolute: true,
                cwd: context.cwd.path(),
                ignore: ['**/node_modules'],
            }).then(function (pkgPaths) {
                return pkgPaths.map(function (pkgPath) {
                    var pkg = fs_extra_1.default.readJsonSync(pkgPath);
                    if (!pkg.private) {
                        pkg.funding = {
                            type: 'ko-fi',
                            url: 'https://ko-fi.com/milesjohnson',
                        };
                    }
                    return fs_extra_1.default.writeJson(pkgPath, pkg, { spaces: 2 });
                });
            });
        }
    });
    return AddFundingScript;
}(core_1.Script));
exports.default = AddFundingScript;
