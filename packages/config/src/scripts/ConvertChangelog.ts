import fs from 'fs-extra';
import glob from 'fast-glob';
import semver from 'semver';
import { Script, ScriptContext } from '@beemo/core';

export default class ConvertChangelogScript extends Script {
  blueprint() {
    return {};
  }

  async execute(context: ScriptContext): Promise<void[]> {
    const files = await glob('**/CHANGELOG.md', {
      absolute: true,
      cwd: context.cwd.path(),
      ignore: ['node_modules'],
    });

    return Promise.all(files.map((filePath) => this.convertChangelog(filePath)));
  }

  async convertChangelog(filePath: string): Promise<void> {
    const data: string[] = [];
    let lastVersion = '0.0.0';

    (await fs.readFile(filePath, 'utf8'))
      .split('\n')
      .reverse()
      .forEach((line) => {
        if (line === '#### 🚀 New') {
          data.push('#### 🚀 Updates');
        } else if (line === '#### 🐞 Fix' || line === '#### 🐞 Fixed') {
          data.push('#### 🐞 Fixes');
        } else if (line === '#### 🛠 Internal') {
          data.push('#### 🛠 Internals');
        } else {
          data.push(
            this.updateTimestamp(
              this.updateVersionHeader(line, lastVersion, (nextVersion) => {
                lastVersion = nextVersion;
              }),
            ),
          );
        }
      });

    await fs.writeFile(filePath, data.reverse().join('\n'), 'utf8');
  }

  updateVersionHeader(line: string, lastVersion: string, cb: (version: string) => void): string {
    const headerSize = {
      major: 1,
      minor: 2,
      patch: 3,
      premajor: 1,
      preminor: 2,
      prepatch: 3,
    };

    return line.replace(/^# (\d+\.\d+\.\d+)/u, (match, version) => {
      const diff = semver.diff(lastVersion, version) as keyof typeof headerSize;

      cb(version);

      return match.replace('#', '#'.repeat(headerSize[diff] || 3));
    });
  }

  updateTimestamp(line: string): string {
    return line.replace(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/u, (match, month, day, year) =>
      // prettier-ignore
      [
        year.length === 2 ? `20${year}` : year,
        month.padStart(2, '0'),
        day.padStart(2, '0'),
      ].join('-'),
    );
  }
}
