const execa = require('execa');
const log = require('./log');

const args = process.argv.slice(2);

module.exports = function run(type, message, ...commands) {
  const env = Object.assign({}, process.env);
  let promise;

  if (commands.length === 0) {
    promise = Promise.reject(new Error('No executable commands'));
  } else {
    promise = Promise.all(commands.map(command => (
      execa(type, [
        ...command,
        ...args,
      ], {
        env: Object.assign(env, {
          BUILD_CURRENT_RUN: type,
          NODE_ENV: 'test',
        }),
      })
    )));
  }

  return promise
    .then((outputs) => {
      log.success(type, message);

      outputs.forEach((out) => {
        if (out.stdout) {
          log.log(type, `\n${out.stdout}`);
        } else if (out.stderr) {
          log.log(type, `\n${out.stderr}`);
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