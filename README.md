# 👨‍💻 MilesOSS Dev Tools

I got tired of duplicating dev tool configuration files over and over again between projects, so I
built [Beemo](https://github.com/milesj/beemo) and subsequently this repository to house them. The
following tools are pre-configured:

- [Babel](https://github.com/milesj/build-tool-config/blob/master/packages/config/configs/babel.js)
  - Configured with `env`, `react`, and `typescript` presets.
  - Builds both CommonJS (cjs) and ECMAScript modules (esm).
  - Builds using the Babel runtime.
  - Cleans the target folder automatically.
  - Supports a Node.js specific configuration.
- [ESLint](https://github.com/milesj/build-tool-config/blob/master/packages/config/configs/eslint.js)
  - Configured with `import`, `jest`, `react`, `jsx-a11y`, `typescript`, `promise`, and `unicorn`
    plugins.
  - Extends the `airbnb` configuration preset.
  - Provides a default `.eslintignore`.
- [Jest](https://github.com/milesj/build-tool-config/blob/master/packages/config/configs/jest.js)
  - Provides built-in code coverage thresholds.
- [Prettier](https://github.com/milesj/build-tool-config/blob/master/packages/config/configs/prettier.js)
  - Configured to closely align with the Airbnb style guide.
  - Provides a default `.prettierignore`.
- [TypeScript](https://github.com/milesj/build-tool-config/blob/master/packages/config/configs/typescript.js)
  - Configured to build ESM compatible files.
  - Strict typing enabled.
- [Templates that can be scaffolded](https://github.com/milesj/build-tool-config/tree/master/packages/config/templates)
  into each project.
- Full TypeScript support out of the box.
- Integrated workspaces (monorepo) support.
- And much more!

## Install

```
yarn add @milesj/build-tools --dev
```

To compile Babel with its runtime, add the dependency per package.

```
yarn add @babel/runtime
```

Finally, add the following Beemo configuration to the root `package.json`.

```json
{
  "beemo": {
    "module": "@milesj/build-tools",
    "drivers": ["babel", "eslint", "jest", "prettier", "typescript"]
  }
}
```

## Init Project

To make use of the tools and to define default settings, we need to configure our `package.json`. To
do this, run the following command in the project root.

```
yarn beemo run-script init
```

The following options are available:

- `--local` (bool) - Project should use local configuration files.
- `--node` (bool) - Project targets Node.js and not the browser.
- `--react` (bool) - Project uses React.
- `--workspaces` (bool) - Project is a monorepo and uses Yarn workspaces.

## Sync Dotfiles

Some tools require dotfiles to be local to the project, which sucks. To get around this, we can
easily scaffold them to each project, by running the following command in the project root.

```
yarn beemo scaffold project dotfiles
```

## Lerna Support

Some projects require Lerna to manage multiple packages within the same repository -- a monorepo.
Lerna isn't available out of the box as the dependency is quite large, most projects don't need it,
and it's just too complicated to get working correctly.

So to support Lerna, please follow these instructions per project.

```
yarn add lerna --dev
```

Run the `init` script with the `workspaces` flag.

```
yarn beemo run-script init --workspaces
```

And remaining setup, like converting old Yarn scripts, or moving files to package folders. That
should be it.
