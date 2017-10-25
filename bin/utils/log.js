const chalk = require('chalk');

module.exports = {
  error(type, message) {
    this.log(type, chalk.red(`✖ ${message}`));
  },

  log(type, message) {
    console.log(chalk.gray(`[${type}]`), message);
  },

  success(type, message) {
    this.log(type, chalk.green(`✔ ${message}`));
  },
};
