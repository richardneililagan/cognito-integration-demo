require('dotenv').config()
require('cross-fetch/polyfill')

const {
  CognitoUserPool,
  CognitoUserAttribute,
} = require('amazon-cognito-identity-js')

// :: ---

const pooldata = {
  UserPoolId: process.env.APP_COGNITO_USERPOOL_ID,
  ClientId: process.env.APP_COGNITO_USERPOOL_CLIENT_ID,
}
const userpool = new CognitoUserPool(pooldata)

// :: ---

module.exports.handler = async (event) => {
  const body = JSON.parse(event.body)

  const email = new CognitoUserAttribute({
    Name: 'email',
    Value: body.email, // <--
  })

  const phoneNumber = new CognitoUserAttribute({
    Name: 'phone_number',
    Value: body.phone_number, // <--
  })

  const attributeList = [email, phoneNumber]

  const task = new Promise((resolve, reject) => {
    userpool.signUp(
      body.username, // <--
      body.password, // <--
      attributeList,
      null,
      (err, result) => {
        if (err)
          return reject({
            statusCode: 400,
            body: err.message || JSON.stringify(err),
          })

        // :: ---
        const { user } = result
        resolve({
          statusCode: 200,
          body: `User ${user.getUsername()} successfully created.`,
        })
      }
    )
  })

  return task
}
