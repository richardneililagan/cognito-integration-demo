const AWS = require('aws-sdk/global')
const { CognitoUserPool } = require('amazon-cognito-identity-js')

// :: ---

const pooldata = {
  UserPoolId: process.env.APP_COGNITO_USERPOOL_ID,
  ClientId: process.env.APP_COGNITO_USERPOOL_CLIENT_ID,
}
const pool = new CognitoUserPool(pooldata)

// :: ---

const getUser = () => pool.getCurrentUser()

const isLoggedIn = () => !!getUser()

const isFederated = () => {
  return !!AWS.config.credentials.cognito
}

// :: ---

module.exports = { getUser, isLoggedIn, isFederated }
