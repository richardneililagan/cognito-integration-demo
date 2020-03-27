#!/usr/bin/env node

const { program } = require('commander')
const { version } = require('../package.json')

const { log, success, error } = require('./helpers/logging')

// :: ---

async function main() {
  program.version(version)

  // (1) Register a new user
  program
    .command('register-user <username> <password> <email> <phone_number>')
    .description('Creates a new Cognito user.')
    .action(async (username, password, email, phone_number) => {
      const { handler } = require('./handlers/register-user')
      const body = JSON.stringify({
        username,
        password,
        email,
        phone_number,
      })

      try {
        const result = await handler({ body })
        success(result.body)
      } catch (err) {
        error(err.body)
      }
    })

  // (2) Confirm user registration
  program
    .command('confirm-user <username> <nonce>')
    .description('Confirms user registration using the confirmation code.')
    .action(async (username, nonce) => {
      const { handler } = require('./handlers/confirm-registration')
      const body = JSON.stringify({
        username,
        nonce,
      })

      try {
        const result = await handler({ body })
        success(result.body)
      } catch (err) {
        error(err.body)
      }
    })

  program.parseAsync(process.argv)
}

main()
