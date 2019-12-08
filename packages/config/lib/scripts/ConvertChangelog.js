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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_extra_1 = __importDefault(require("fs-extra"));
var fast_glob_1 = __importDefault(require("fast-glob"));
var semver_1 = __importDefault(require("semver"));
var core_1 = require("@beemo/core");
var ConvertChangelogScript = /** @class */ (function (_super) {
    __extends(ConvertChangelogScript, _super);
    function ConvertChangelogScript() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ConvertChangelogScript.prototype, "blueprint", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function () {
            return {};
        }
    });
    Object.defineProperty(ConvertChangelogScript.prototype, "execute", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (context) {
            return __awaiter(this, void 0, void 0, function () {
                var files;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fast_glob_1.default('**/CHANGELOG.md', {
                                absolute: true,
                                cwd: context.cwd.path(),
                                ignore: ['node_modules'],
                            })];
                        case 1:
                            files = _a.sent();
                            return [2 /*return*/, Promise.all(files.map(function (filePath) { return _this.convertChangelog(filePath); }))];
                    }
                });
            });
        }
    });
    Object.defineProperty(ConvertChangelogScript.prototype, "convertChangelog", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (filePath) {
            return __awaiter(this, void 0, void 0, function () {
                var data, lastVersion;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            data = [];
                            lastVersion = '0.0.0';
                            return [4 /*yield*/, fs_extra_1.default.readFile(filePath, 'utf8')];
                        case 1:
                            (_a.sent())
                                .split('\n')
                                .reverse()
                                .forEach(function (line) {
                                if (line === '#### 🚀 New') {
                                    data.push('#### 🚀 Updates');
                                }
                                else if (line === '#### 🐞 Fix' || line === '#### 🐞 Fixed') {
                                    data.push('#### 🐞 Fixes');
                                }
                                else if (line === '#### 🛠 Internal') {
                                    data.push('#### 🛠 Internals');
                                }
                                else {
                                    data.push(_this.updateTimestamp(_this.updateVersionHeader(line, lastVersion, function (nextVersion) {
                                        lastVersion = nextVersion;
                                    })));
                                }
                            });
                            fs_extra_1.default.writeFile(filePath, data.reverse().join('\n'), 'utf8');
                            return [2 /*return*/];
                    }
                });
            });
        }
    });
    Object.defineProperty(ConvertChangelogScript.prototype, "updateVersionHeader", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (line, lastVersion, cb) {
            var headerSize = {
                major: 1,
                minor: 2,
                patch: 3,
                premajor: 1,
                preminor: 2,
                prepatch: 3,
            };
            return line.replace(/^# (\d+\.\d+\.\d+)/u, function (match, version) {
                var diff = semver_1.default.diff(lastVersion, version);
                cb(version);
                return match.replace('#', '#'.repeat(headerSize[diff] || 3));
            });
        }
    });
    Object.defineProperty(ConvertChangelogScript.prototype, "updateTimestamp", {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (line) {
            return line.replace(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/u, function (match, month, day, year) {
                // prettier-ignore
                return [
                    year.length === 2 ? "20" + year : year,
                    month.padStart(2, '0'),
                    day.padStart(2, '0'),
                ].join('-');
            });
        }
    });
    return ConvertChangelogScript;
}(core_1.Script));
exports.default = ConvertChangelogScript;
