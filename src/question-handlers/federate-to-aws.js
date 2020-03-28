const inquirer = require('inquirer')
const { success, error } = require('../helpers/logging')

const { isLoggedIn } = require('../state')

// :: ---

const questions = [
  {
    name: 'confirm',
    type: 'confirm',
    message: 'Federate current logged in user to AWS?',
    default: false,
  },
]

// :: ---

const prompt = 'Federate logged in user to AWS.'

const isAvailable = isLoggedIn

const handler = async () => {
  const { confirm } = await inquirer.prompt(questions)
  if (!confirm) return

  // :: ---
  const { handler } = require('../handlers/federate-to-aws')

  try {
    const result = await handler()
    success(result.body)
  } catch (err) {
    error(err.body || err)
  }
}

// :: ---

module.exports = { prompt, handler, isAvailable }
