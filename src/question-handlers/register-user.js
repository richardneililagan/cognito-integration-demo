const inquirer = require('inquirer')

// :: ---

const questions = [
  {
    name: 'username',
    message: 'Enter a username.',
    validate: (input) => {
      return input.length > 4 || 'Username has to be longer than 4 characters.'
    },
  },
  {
    name: 'email',
    message: 'Enter an email address.',
    // :: TODO validate email via regex
  },
  {
    name: 'phone_number',
    message: 'Enter a phone number.',
    // :: TODO validate phone number via regex
  },
  {
    name: 'password',
    type: 'password',
    message: 'Enter a password.',
    validate: (input) => {
      return input.length > 8 || 'Password has to be longer than 8 characters.'
    },
  },
  {
    name: 'confirm-password',
    type: 'password',
    message: 'Please retype password',
    validate: (input, { password }) => {
      return input === password || 'Password should match.'
    },
  },
]

// :: ---

const prompt = 'Register a new Cognito user'

const isAvailable = () => true

const handler = async () => await inquirer.prompt(questions)

// :: ---

module.exports = { prompt, handler, isAvailable }
