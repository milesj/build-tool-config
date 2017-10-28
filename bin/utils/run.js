const log = require('./log');

module.exports = function run(type, commands, message) {
  let promise;

  if (Array.isArray(commands)) {
    if (commands.length === 0) {
      log.error(type, 'No commands to run');

      process.exitCode = 2;

      return Promise.reject();
    }

    promise = Promise.all(commands);
  } else {
    promise = Promise.resolve(commands);
  }

  return promise.then((output) => {
    log.success(type, message);

    return output;
  }).catch((error) => {
    log.error(type, `Failed to execute: ${error.message}`);

    process.exitCode = 1;
  });
};
