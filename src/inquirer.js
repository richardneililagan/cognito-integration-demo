const inquirer = require('inquirer')

// :: ---

const CHOICE_MAP = [require('./question-handlers/register-user')]

// :: ---

function __choice({ prompt, handler, isAvailable }) {
  return isAvailable() ? { prompt, handler } : null
}

function getAvailableChoices() {
  const choices = CHOICE_MAP.map(__choice)

  return choices.filter((choice) => choice !== null)
}

async function ask() {
  const availableChoices = getAvailableChoices()

  const { operation } = await inquirer.prompt([
    {
      type: 'list',
      name: 'operation',
      message: 'Select an operation:',
      choices: () => availableChoices.map(({ prompt }) => prompt),
    },
  ])

  const { handler } = availableChoices.filter(
    ({ prompt }) => prompt === operation
  )[0]

  await handler()
}

ask()
