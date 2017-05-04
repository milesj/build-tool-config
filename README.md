# build-tool-config

I got tired of duplicating build tool configuration files over and over again between projects,
so I built this repository to house them. The following tools are pre-configured:

* [Babel](https://github.com/milesj/build-tool-config/blob/master/babel.json)
* [ESLint](https://github.com/milesj/build-tool-config/blob/master/eslint.js)
* [Jest](https://github.com/milesj/build-tool-config/blob/master/jest.json)

Plus configurations files that can be synced into each project (as they must exist in each project).

* [Flow](https://github.com/milesj/build-tool-config/blob/master/res/.flowconfig)
* [Git](https://github.com/milesj/build-tool-config/blob/master/res/.gitignore)
* [NPM](https://github.com/milesj/build-tool-config/blob/master/res/.npmignore)
* [Travis](https://github.com/milesj/build-tool-config/blob/master/res/.travis.yml)

## Install

```
yarn add @milesj/build-tool-config
```

To sync project required configuration files, run the following in the project root.

```
node ./node_modules/.bin/sync-configs
```

## Usage

This library provides binaries that can be consumed per project, they are.

* `build-lib` - Build the library using Babel.
* `run-linter` - Lint files using ESLint.
* `run-tests` - Run unit tests using Jest.
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

### Babel

Babel doesn't allow custom `.babelrc` paths, so to work around this,
add the following to `package.json`.

```json
"babel": {
  "extends": "./node_modules/@milesj/build-tool-config/babel.json"
}
```

> Use `babel.node.json` when building a Node.js specific library.
