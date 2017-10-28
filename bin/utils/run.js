const log = require('./log');

module.exports = function run(type, commands, message) {
  let promise;

  process.env.BUILD_CURRENT_RUN = type;

  if (Array.isArray(commands)) {
    if (commands.length === 0) {
      const error = new Error('No executable commands');
      error.code = 2;

      promise = Promise.reject(error);
    } else {
      promise = Promise.all(commands);
    }
  } else {
    promise = Promise.all([commands]);
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
    })
    .then((value) => {
      process.env.BUILD_CURRENT_RUN = '';

      return value;
    });
};
