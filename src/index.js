#!/usr/bin/env node

const { program } = require('commander')
const { version } = require('../package.json')

const { log, success, error } = require('./helpers/logging')

// :: ---

async function main() {
  program.version(version)

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

  program.parseAsync(process.argv)
}

main()
