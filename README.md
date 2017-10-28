# build-tool-config

I got tired of duplicating build tool configuration files over and over again between projects,
so I built this repository to house them. The following tools are pre-configured:

* [Babel](https://github.com/milesj/build-tool-config/blob/master/configs/babel.js)
  * Configured with `env`, `stage-2`, `react`, and `flow` presets.
  * Builds both CommonJS (cjs) and ECMAScript modules (esm).
  * Builds using the `babel-runtime`.
  * Cleans the target folder automatically.
  * Supports a Node.js specific configuration.
* [ESLint](https://github.com/milesj/build-tool-config/blob/master/configs/eslint.js)
  * Configured with `import`, `jest`, `react`, `jsx-a11y`, `flowtype`, and `unicorn` plugins.
  * Extends the `airbnb` configuration preset.
  * Provides `.eslintignore` when syncing dotfiles.
* [Jest](https://github.com/milesj/build-tool-config/blob/master/configs/jest.js)
  * Supports React and Enzyme 3 based unit tests.
  * Provides built-in code coverage scripts.
* [Webpack](https://github.com/milesj/build-tool-config/blob/master/configs/webpack.js)
  * Configured with `babel-loader` and `uglify` plugin.

Plus dotfiles that can be synced into each project (as they must exist in each project).

* [ESLint](https://github.com/milesj/build-tool-config/blob/master/dotfiles/eslintignore)
* [Flow](https://github.com/milesj/build-tool-config/blob/master/dotfiles/flowconfig)
* [Git](https://github.com/milesj/build-tool-config/blob/master/dotfiles/gitignore)
* [NPM](https://github.com/milesj/build-tool-config/blob/master/dotfiles/npmignore)
* [Travis](https://github.com/milesj/build-tool-config/blob/master/dotfiles/travis.yml)
* [Yarn](https://github.com/milesj/build-tool-config/blob/master/dotfiles/yarnrc)

## Install

```
yarn add @milesj/build-tool-config --dev
```

To compile Babel with its runtime, add the dependency per project (non-Node.js only).

```
yarn add babel-runtime
```

## Sync Configuration

Some build tools require dotfiles to be local to the project, which sucks.
To get around this, we can easily sync them to each project, by running the following
command in the project root.

```
node ./node_modules/.bin/sync-configs
```

## Init Package

To make use of `babel` and `eslint`, we need to configure our `package.json` to
extend from the presets. To do this, run the following command in the project root.

```
node ./node_modules/.bin/init-package
```

## Scripts Usage

This library provides the following binaries that can be consumed per project.

* `build-lib` - Transpiles the root `src/` folder to both CommonJS (main) and ECMAScript (module) builds using Babel.
  * `--no-clean` - Disable automatic target cleaning.
  * `--no-cjs` - Disable CommonJS `lib/` builds.
  * `--no-esm` - Disable ECMAScript `esm/` builds.
  * `--node` - Target Node.js 6.5+ instead of web (IE 10+).
  * `--react` - Include `babel-preset-react`.
* `bundle-lib` - Bundles the library into a single file using Webpack.
* `run-linter` - Lints source, test, and packages files using ESLint.
  * `--cache` - Speed up the linting process.
* `run-tests` - Runs unit tests using Jest.
  * `--coverage` - Run code coverage.
* `type-check` - Statically analyzes and type checks files using Flowtype.

Simply add them as Yarn scripts or run `init-package` mentioned previously.

```json
"scripts": {
  "build": "build-lib",
  "bundle": "bundle-lib",
  "lint": "run-linter",
  "test": "run-tests",
  "flow": "type-check",
}
```

> CLI options are passed through.

## Lerna Support

Some projects require Lerna to manage multiple packages within the same repository -- a monorepo.
Lerna isn't available out of the box as the dependency is quite large, most projects don't need it,
and it's just too complicated to get working correctly.

So to support Lerna, please follow these instructions per project.

```
yarn add lerna --dev
```

Run the `init-package` command with a `lerna` flag.

```
node ./node_modules/.bin/init-package --lerna
```

Update `.travis.yml` to boostrap Lerna.

```yaml
before_script: yarn run bootstrap:slow
```

And remaining setup, like converting old Yarn scripts, or moving files to package folders.
That should be it.

### Configuring Packages

To build packages using `lerna run`, each package must install this project as a dev
dependency, while also configuring the Yarn `build` script, like so.

```json
"scripts": {
  "build": "build-lib"
},
```
