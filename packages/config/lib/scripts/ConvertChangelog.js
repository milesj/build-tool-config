"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const fast_glob_1 = __importDefault(require("fast-glob"));
const semver_1 = __importDefault(require("semver"));
const core_1 = require("@beemo/core");
class ConvertChangelogScript extends core_1.Script {
    blueprint() {
        return {};
    }
    execute(context) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield fast_glob_1.default('**/CHANGELOG.md', {
                absolute: true,
                cwd: context.cwd.path(),
                ignore: ['node_modules'],
            });
            return Promise.all(files.map(filePath => this.convertChangelog(filePath)));
        });
    }
    convertChangelog(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = [];
            let lastVersion = '0.0.0';
            (yield fs_extra_1.default.readFile(filePath, 'utf8'))
                .split('\n')
                .reverse()
                .forEach(line => {
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
                    data.push(this.updateTimestamp(this.updateVersionHeader(line, lastVersion, nextVersion => {
                        lastVersion = nextVersion;
                    })));
                }
            });
            fs_extra_1.default.writeFile(filePath, data.reverse().join('\n'), 'utf8');
        });
    }
    updateVersionHeader(line, lastVersion, cb) {
        const headerSize = {
            major: 1,
            minor: 2,
            patch: 3,
            premajor: 1,
            preminor: 2,
            prepatch: 3,
        };
        return line.replace(/^# (\d+\.\d+\.\d+)/u, (match, version) => {
            const diff = semver_1.default.diff(lastVersion, version);
            cb(version);
            return match.replace('#', '#'.repeat(headerSize[diff] || 3));
        });
    }
    updateTimestamp(line) {
        return line.replace(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/u, (match, month, day, year) => 
        // prettier-ignore
        [
            year.length === 2 ? `20${year}` : year,
            month.padStart(2, '0'),
            day.padStart(2, '0'),
        ].join('-'));
    }
}
exports.default = ConvertChangelogScript;
