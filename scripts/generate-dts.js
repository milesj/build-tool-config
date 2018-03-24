const { Script } = require('@beemo/core');
const generate = require('dts-generator').default;

module.exports = class GenerateDtsScript extends Script {
  parse() {
    return {
      default: {
        name: '',
      },
      string: ['name'],
    };
  }

  run(options, tool) {
    const name = options.name || tool.package.name;

    return generate({
      indent: '  ',
      name: `${name}/lib`,
      out: 'index.d.ts',
      project: tool.options.root,
      resolveModuleId({ currentModuleId }) {
        return currentModuleId === 'index' ? name : null;
      },
    });
  }
};
