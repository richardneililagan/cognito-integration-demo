require('dotenv').config()
require('cross-fetch/polyfill')

const AWS = require('aws-sdk/global')
const { CognitoUserPool } = require('amazon-cognito-identity-js')

// :: ---

const AWS_REGION = process.env.APP_AWS_REGION || 'ap-southeast-1'
const USERPOOL_ID = process.env.APP_COGNITO_USERPOOL_ID
const USERPOOL_CLIENT_ID = process.env.APP_COGNITO_USERPOOL_CLIENT_ID
const IDENTITYPOOL_ID = process.env.APP_COGNITO_IDENTITYPOOL_ID

const LOGIN_KEY = `cognito-idp.${AWS_REGION}.amazonaws.com/${USERPOOL_ID}`

const pool = new CognitoUserPool({
  UserPoolId: USERPOOL_ID,
  ClientId: USERPOOL_CLIENT_ID,
})

// :: ---

module.exports.handler = async () => {
  // :: grab the current logged in user session
  const session = await new Promise((resolve, reject) => {
    const user = pool.getCurrentUser()
    user.getSession((err, result) => {
      if (err) return reject(err)
      // :: ---
      resolve(result)
    })
  })

  const token = session.getIdToken().getJwtToken()

  AWS.config.region = AWS_REGION
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IDENTITYPOOL_ID,
    Logins: {
      [LOGIN_KEY]: token,
    },
  })

  // :: perform ---
  const task = new Promise((resolve, reject) => {
    AWS.config.credentials.refresh((err) => {
      if (err)
        return reject({
          statusCode: 400,
          body: err.message || JSON.stringify(err),
        })

      // :: ---
      resolve({
        statusCode: 200,
        body: 'Authenticated to the AWS SDK.',
      })
    })
  })

  return task
}
