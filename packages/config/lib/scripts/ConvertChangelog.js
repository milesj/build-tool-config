"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fast_glob_1 = __importDefault(require("fast-glob"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const semver_1 = __importDefault(require("semver"));
const core_1 = require("@beemo/core");
class ConvertChangelogScript extends core_1.Script {
    blueprint() {
        return {};
    }
    async execute(context) {
        const files = await fast_glob_1.default('**/CHANGELOG.md', {
            absolute: true,
            cwd: context.cwd.path(),
            ignore: ['node_modules'],
        });
        return Promise.all(files.map((filePath) => this.convertChangelog(filePath)));
    }
    async convertChangelog(filePath) {
        const data = [];
        let lastVersion = '0.0.0';
        (await fs_extra_1.default.readFile(filePath, 'utf8'))
            .split('\n')
            .reverse()
            .forEach((line) => {
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
                data.push(this.updateTimestamp(this.updateVersionHeader(line, lastVersion, (nextVersion) => {
                    lastVersion = nextVersion;
                })));
            }
        });
        await fs_extra_1.default.writeFile(filePath, data.reverse().join('\n'), 'utf8');
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
