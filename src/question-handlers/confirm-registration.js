const inquirer = require('inquirer')
const { log, success, error } = require('../helpers/logging')

// :: ---

const questions = [
  {
    name: 'username',
    message: 'Enter username:',
    validate: (input) => {
      return input.length > 4 || 'Username has to be longer than 4 characters.'
    },
  },
  {
    name: 'nonce',
    message: 'Enter confirmation code:',
  },
]

// :: ---

const prompt = 'Confirm new user registration.'

const isAvailable = () => true

const handler = async () => {
  const answers = await inquirer.prompt(questions)
  const { handler } = require('../handlers/confirm-registration')
  const body = JSON.stringify(answers)

  try {
    const result = await handler({ body })
    success(result.body)
  } catch (err) {
    error(err.body)
  }
}

// :: ---

module.exports = { prompt, handler, isAvailable }
