require('dotenv').config()
require('cross-fetch/polyfill')

const AWS = require('aws-sdk/global')
const { CognitoUserPool } = require('amazon-cognito-identity-js')

// :: ---

const AWS_REGION = process.env.APP_AWS_REGION || 'ap-southeast-1'
const USERPOOL_ID = process.env.APP_COGNITO_USERPOOL_ID
const USERPOOL_CLIENT_ID = process.env.APP_COGNITO_USERPOOL_CLIENT_ID

const LOGIN_KEY = `cognito-idp.${AWS_REGION}.amazonaws.com/${USERPOOL_ID}`

const pool = new CognitoUserPool({
  UserPoolId: USERPOOL_ID,
  ClientId: USERPOOL_CLIENT_ID,
})

// :: ---

module.exports.handler = async () => {
  const user = pool.getCurrentUser()

  const session = await new Promise((resolve, reject) => {
    user.getSession((err, result) => {
      if (err) return reject(err)
      // :: ---
      resolve(result)
    })
  })

  const refreshToken = session.getRefreshToken()

  // :: perform ---
  const task = new Promise((resolve, reject) => {
    user.refreshSession(refreshToken, (err, session) => {
      if (err)
        return reject({
          statusCode: 400,
          body: err.message || JSON.stringify(err),
        })
      // :: ---

      const { credentials } = AWS.config
      const token = session.getIdToken().getJwtToken()

      credentials.params.Logins[LOGIN_KEY] = token

      credentials.refresh((err) => {
        if (err)
          return reject({
            statusCode: 400,
            body: err.message || JSON.stringify(err),
          })
        // :: ---

        resolve({
          statusCode: 200,
          body: 'Session successfully refreshed.',
        })
      })
    })
  })

  return task
}
