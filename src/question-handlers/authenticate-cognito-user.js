const inquirer = require('inquirer')
const { success, error } = require('../helpers/logging')

const { isLoggedIn, setUser, setSession } = require('../state')

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
    name: 'password',
    type: 'password',
    message: 'Enter password:',
  },
]

// :: ---

const prompt = 'Log in as user.'

const isAvailable = () => !isLoggedIn()

const handler = async () => {
  const answers = await inquirer.prompt(questions)
  const { handler } = require('../handlers/authenticate-cognito-user')
  const body = JSON.stringify(answers)

  try {
    const result = await handler({ body })
    success(result.body)
  } catch (err) {
    error(err.body || err)
  }
}

// :: ---

module.exports = { prompt, handler, isAvailable }
