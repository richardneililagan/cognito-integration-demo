#!/usr/bin/env node

require('dotenv').config()

const inquirer = require('inquirer')
const { log, info, warn, debug } = require('./helpers/logging')
const { isLoggedIn, isFederated, getUser } = require('./state')

// :: ---

const __separator = {
  prompt: new inquirer.Separator(),
  isAvailable: () => true,
  handler: () => {},
}

const CHOICE_MAP = [
  require('./question-handlers/authenticate-cognito-user'),
  require('./question-handlers/federate-to-aws'),
  require('./question-handlers/refresh-session'),
  __separator,
  require('./question-handlers/register-user'),
  require('./question-handlers/confirm-registration'),
  require('./question-handlers/resend-confirmation'),
  {
    prompt: 'Exit',
    isAvailable: () => true,
    handler: () => process.exit(0),
  },
]

// :: ---

function __choice({ prompt, handler, isAvailable }) {
  return isAvailable() ? { prompt, handler } : null
}

function getAvailableChoices() {
  const choices = CHOICE_MAP.map(__choice)

  return choices.filter((choice) => choice !== null)
}

function blurb() {
  if (isLoggedIn()) {
    info(`Current logged in user: ${getUser().username}`)
  } else {
    warn('No logged in user.')
  }

  if (isFederated()) {
    info('Federated to the AWS SDK.')
  } else {
    warn('Not federated to the AWS SDK.')
  }

  log()
}

async function ask() {
  while (true) {
    blurb()

    const availableChoices = getAvailableChoices()

    const { operation } = await inquirer.prompt([
      {
        type: 'rawlist',
        name: 'operation',
        message: 'Select an operation:',
        choices: () => availableChoices.map(({ prompt }) => prompt),
      },
    ])

    log()

    const { handler } = availableChoices.filter(
      ({ prompt }) => prompt === operation
    )[0]

    await handler()

    log()
  }
}

console.clear()
ask()
