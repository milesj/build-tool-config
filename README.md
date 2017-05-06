# build-tool-config

I got tired of duplicating build tool configuration files over and over again between projects,
so I built this repository to house them. The following tools are pre-configured:

* [Babel](https://github.com/milesj/build-tool-config/blob/master/babel.json5)
* [ESLint](https://github.com/milesj/build-tool-config/blob/master/eslint.json5)
* [Jest](https://github.com/milesj/build-tool-config/blob/master/jest.json)

Plus configurations files that can be synced into each project (as they must exist in each project).

* [Flow](https://github.com/milesj/build-tool-config/blob/master/res/flowconfig)
* [Git](https://github.com/milesj/build-tool-config/blob/master/res/gitignore)
* [NPM](https://github.com/milesj/build-tool-config/blob/master/res/npmignore)
* [Travis](https://github.com/milesj/build-tool-config/blob/master/res/travis.yml)

## Install

```
yarn add @milesj/build-tool-config
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
"eslint": {
  "extends": "./node_modules/@milesj/build-tool-config/eslint.json5"
},
"jest": {
  "preset": "@milesj/build-tool-config"
}
```

> Use `babel.node.json5` when building a Node.js specific library.

## Usage

This library provides binaries that can be consumed per project, they are.

* `build-lib` - Build the library using Babel. Will clean the target folder automatically.
* `run-linter` - Lint files using ESLint. Will also ignore files automatically.
* `run-tests` - Run unit tests using Jest. Also supports code coverage.
* `type-check` - Statically analyze and type check files using Flowtype (in progress).

Simply add them as NPM/Yarn scripts.

```json
"scripts": {
  "build": "build-lib ./src -d ./lib",
  "lint": "run-linter ./src ./tests",
  "test": "run-tests",
  "flow": "type-check",
}
```

> CLI options are passed through.
