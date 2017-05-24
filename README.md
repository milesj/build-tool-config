# build-tool-config

I got tired of duplicating build tool configuration files over and over again between projects,
so I built this repository to house them. The following tools are pre-configured:

* [Babel](https://github.com/milesj/build-tool-config/blob/master/babel.json5)
  * Configured with `env`, `stage-2`, `react`, and `flow` presets.
  * Builds using the `babel-runtime`.
  * Cleans the target folder automatically.
  * Supports a Node.js specific configuration.
* [ESLint](https://github.com/milesj/build-tool-config/blob/master/eslint.json5)
  * Configured with `import`, `jest`, `react`, `jsx-a11y`, and `flowtype` plugins.
  * Extends the `airbnb` configuration preset.
  * Provides `.eslintignore` when syncing configs.
* [Jest](https://github.com/milesj/build-tool-config/blob/master/jest.json)
  * Supports React and Enzyme based unit tests.
  * Provides code coverage scripts.
* [Rollup](https://github.com/milesj/build-tool-config/blob/master/rollup.js)
  * Configured with `commonjs`, `babel`, and `json` plugins.
  * Customized output through the `--format` option.

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

To sync project required configuration files, like ignore files,
run the following command in the project root.

```
node ./node_modules/.bin/sync-configs
```

## Setup

Add the following to `package.json` to extend the base configuration files.

```json
"babel": {
  "extends": "./node_modules/@milesj/build-tool-config/babel.json5"
},
"eslintConfig": {
  "extends": "./node_modules/@milesj/build-tool-config/eslint.json5"
},
"jest": {
  "preset": "@milesj/build-tool-config"
}
```

> Use `babel.node.json5` when building a Node.js specific library.

## Usage

This library provides binaries that can be consumed per project, they are.

* `build-lib` - Builds the library using Babel.
* `bundle-lib` - Bundles the library into a single file using Rollup.
* `run-linter` - Lints files using ESLint.
* `run-tests` - Runs unit tests using Jest.
* `run-coverage` - Runs unit test code coverage using Jest.
* `type-check` - Statically analyzes and type checks files using Flowtype.

Simply add them as NPM/Yarn scripts.

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
