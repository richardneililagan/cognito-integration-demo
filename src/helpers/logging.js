const chalk = require('chalk')

// :: ---

const __output = (theme) => {
  return (...messages) => console.log(theme(...messages))
}

// :: ---

module.exports.debug = __output(chalk.grey)
module.exports.log = __output(chalk.white)
module.exports.info = __output(chalk.cyan)
module.exports.success = __output(chalk.greenBright)
module.exports.warn = __output(chalk.yellowBright)
module.exports.error = __output(chalk.redBright)
