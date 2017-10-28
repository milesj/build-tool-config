const execa = require('execa');
const log = require('./log');

const args = process.argv.slice(2);

module.exports = function run(type, message, ...commands) {
  let promise;

  if (commands.length === 0) {
    promise = Promise.reject(new Error('No executable commands'));
  } else {
    promise = Promise.all(commands.map(command => (
      execa(type, [
        ...command,
        ...args,
      ], {
        env: {
          BUILD_CURRENT_RUN: type,
          NODE_ENV: 'test',
        },
      })
    )));
  }

  return promise
    .then((outputs) => {
      log.success(type, message);

      outputs.forEach((out) => {
        if (out.stdout) {
          log.log(type, out.stdout);
        }
      });

      return outputs;
    })
    .catch((error) => {
      log.error(type, 'Failed to run');
      log.log(type, error.message);

      process.exitCode = error.code || 1;
    });
};
