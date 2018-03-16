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
    return generate({
      indent: '  ',
      name: options.name || tool.package.name,
      out: 'index.d.ts',
      project: tool.options.root,
    }).then(() => {
      tool.log('Generated index.d.ts file.');
    });
  }
};
