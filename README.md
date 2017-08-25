# build-tool-config

I got tired of duplicating build tool configuration files over and over again between projects,
so I built this repository to house them. The following tools are pre-configured:

* [Babel](https://github.com/milesj/build-tool-config/blob/master/babel.json5)
  * Configured with `env`, `stage-2`, `react`, and `flow` presets.
  * Builds using the `babel-runtime`.
  * Cleans the target folder automatically.
  * Supports a Node.js specific configuration.
* [ESLint](https://github.com/milesj/build-tool-config/blob/master/eslint.json5)
  * Configured with `import`, `jest`, `react`, `jsx-a11y`, `flowtype`, and `unicorn` plugins.
  * Extends the `airbnb` configuration preset.
  * Provides `.eslintignore` when syncing configs.
  * Supports parallel tests with `esprint`.
* [Jest](https://github.com/milesj/build-tool-config/blob/master/jest.json)
  * Supports React and Enzyme based unit tests.
  * Provides code coverage scripts.
* [Rollup](https://github.com/milesj/build-tool-config/blob/master/rollup.js)
  * Configured with `commonjs`, `babel`, `json`, and `uglify` plugins.
  * Customized output through the `--format` option.
  * Minifies output using Uglify.

Plus configurations files that can be synced into each project (as they must exist in each project).

* [ESLint](https://github.com/milesj/build-tool-config/blob/master/res/eslintignore)
* [Flow](https://github.com/milesj/build-tool-config/blob/master/res/flowconfig)
* [Git](https://github.com/milesj/build-tool-config/blob/master/res/gitignore)
* [NPM](https://github.com/milesj/build-tool-config/blob/master/res/npmignore)
* [Travis](https://github.com/milesj/build-tool-config/blob/master/res/travis.yml)

## Install

```
yarn add @milesj/build-tool-config --dev
```

To compile Babel with its runtime, add the dependency per project (non-Node.js only).

```
yarn add babel-runtime
```

## Sync Configuration

Some build tools require configuration files to be local to the project, which sucks.
To get around this, we can easily sync them to each project, by running the following
command in the project root.

```
node ./node_modules/.bin/sync-configs
```

## Init Package

To make use of `babel`, `eslint`, and `jest`, we need to configure our `package.json` to
extend from the presets. To do this, run the following command in the project root.

```
node ./node_modules/.bin/init-package
```

> Pass `--node` to initialize a Node.js specific package.

## Scripts Usage

This library provides binaries that can be consumed per project, they are.

* `build-lib` - Builds the library using Babel.
  * Pass `--no-clean` to disable automatic target cleaning.
* `bundle-lib` - Bundles the library into a single file using Rollup.
* `run-linter` - Lints files using ESLint.
  * Pass `--parallel` to run tests simultaneously.
* `run-tests` - Runs unit tests using Jest.
* `run-coverage` - Runs unit test code coverage using Jest.
* `type-check` - Statically analyzes and type checks files using Flowtype.

Simply add them as NPM/Yarn scripts, or run `init-package` mentioned previously.

```json
"scripts": {
  "build": "build-lib ./src -d ./lib",
  "bundle": "bundle-lib",
  "cover": "run-coverage",
  "lint": "run-linter ./src ./tests",
  "test": "run-tests",
  "flow": "type-check",
}
```

> CLI options are passed through.

## Lerna Support

Some projects require Lerna to manage multiple packages within the same repository.
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
  "build": "build-lib ./src -d ./lib",
}
```
