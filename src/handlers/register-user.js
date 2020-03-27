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
  const { username, password, email, phone_number } = JSON.parse(event.body)

  const emailAttribute = new CognitoUserAttribute({
    Name: 'email',
    Value: email,
  })

  const phoneNumberAttribute = new CognitoUserAttribute({
    Name: 'phone_number',
    Value: phone_number,
  })

  const attributeList = [emailAttribute, phoneNumberAttribute]

  // :: perform ---
  const task = new Promise((resolve, reject) => {
    userpool.signUp(username, password, attributeList, null, (err, result) => {
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
    })
  })

  return task
}
