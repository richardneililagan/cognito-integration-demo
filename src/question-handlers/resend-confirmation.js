const inquirer = require('inquirer')
const { success, error } = require('../helpers/logging')

// :: ---

const questions = [
  {
    name: 'username',
    message: 'Enter username:',
    validate: (input) => {
      return input.length > 4 || 'Username has to be longer than 4 characters.'
    },
  },
]

// :: ---

const prompt = 'Resend confirmation code for a user.'

const isAvailable = () => true

const handler = async () => {
  const answers = await inquirer.prompt(questions)
  const { handler } = require('../handlers/resend-confirmation-code')
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
