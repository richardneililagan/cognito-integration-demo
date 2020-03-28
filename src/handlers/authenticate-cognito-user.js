require('dotenv').config()
require('cross-fetch/polyfill')

const {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} = require('amazon-cognito-identity-js')

// :: ---

const pooldata = {
  UserPoolId: process.env.APP_COGNITO_USERPOOL_ID,
  ClientId: process.env.APP_COGNITO_USERPOOL_CLIENT_ID,
}
const userpool = new CognitoUserPool(pooldata)

// :: ---

module.exports.handler = async (event) => {
  const { username, password } = JSON.parse(event.body)

  const authdata = {
    Username: username,
    Password: password,
  }
  const authdetails = new AuthenticationDetails(authdata)

  const userdata = {
    Username: username,
    Pool: userpool,
  }
  const user = new CognitoUser(userdata)

  // :: perform ---
  const task = new Promise((resolve, reject) => {
    const onSuccess = (result) => {
      const token = result.getAccessToken().getJwtToken()

      resolve({
        user,
        token,
        session: result,
        statusCode: 200,
        body: `Successfully authenticated ${username}.`,
      })
    }

    const onFailure = (err) => {
      return reject({
        statusCode: 400,
        body: err.message || JSON.stringify(err),
      })
    }

    user.authenticateUser(authdetails, { onSuccess, onFailure })
  })

  return task
}
