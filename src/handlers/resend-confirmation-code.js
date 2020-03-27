require('dotenv').config()
require('cross-fetch/polyfill')

const { CognitoUserPool, CognitoUser } = require('amazon-cognito-identity-js')

// :: ---

const pooldata = {
  UserPoolId: process.env.APP_COGNITO_USERPOOL_ID,
  ClientId: process.env.APP_COGNITO_USERPOOL_CLIENT_ID,
}
const userpool = new CognitoUserPool(pooldata)

// :: ---

module.exports.handler = async (event) => {
  const { username } = JSON.parse(event.body)

  const userdata = {
    Username: username,
    Pool: userpool,
  }
  const user = new CognitoUser(userdata)

  // :: perform ---
  const task = new Promise((resolve, reject) => {
    user.resendConfirmationCode((err, result) => {
      if (err)
        return reject({
          statusCode: 400,
          body: err.message || JSON.stringify(err),
        })

      // :: ---
      resolve({
        statusCode: 200,
        body: `Resend request successful.`,
      })
    })
  })

  return task
}
