const inquirer = require('inquirer')
const { success, error } = require('../helpers/logging')

const { isFederated } = require('../state')

// :: ---

const questions = [
  {
    name: 'confirm',
    type: 'confirm',
    message: 'Refresh current session?',
    default: false,
  },
]

// :: ---

const prompt = 'Refresh current session.'

const isAvailable = isFederated

const handler = async () => {
  const { confirm } = await inquirer.prompt(questions)
  if (!confirm) return

  // :: ---
  const { handler } = require('../handlers/refresh-session')

  try {
    const result = await handler()
    success(result.body)
  } catch (err) {
    error(err.body || err)
  }
}

module.exports = { prompt, handler, isAvailable }
