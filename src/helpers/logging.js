const chalk = require('chalk')

// :: ---

const __output = (theme) => {
  return (...messages) => console.log(theme(...messages))
}

// :: ---

module.exports.debug = __output(chalk.grey)
module.exports.log = __output(chalk.white)
module.exports.info = __output(chalk.inverse.magentaBright)
module.exports.warn = __output(chalk.yellowBright)

const __success = __output(chalk.greenBright)
const __error = __output(chalk.redBright)

module.exports.success = (...messages) => {
  console.clear()
  __success(...messages)
}

module.exports.error = (...messages) => {
  console.clear()
  __error(...messages)
}
