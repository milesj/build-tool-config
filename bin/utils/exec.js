const log = require('./log');

module.exports = function exec(type, commands, message) {
  if (commands.length === 0) {
    log.error(type, 'No commands to run');

    process.exitCode = 2;

    return;
  }

  Promise.all(commands)
    .then(() => {
      log.success(type, message);
    })
    .catch((error) => {
      log.error(type, `Failed to execute: ${error.message}`);

      process.exitCode = 1;
    });
};
