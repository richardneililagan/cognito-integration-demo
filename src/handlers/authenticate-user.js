require('dotenv').config()
require('cross-fetch/polyfill')

const AWS = require('aws-sdk/global')

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
    // :: [OPTION 1]
    const onSuccessTokenOnly = (result) => {
      const token = result.getAccessToken().getJwtToken()
      resolve({
        statusCode: 200,
        body: `Successfully authenticated ${username}. Token is [${token}].`,
      })
    }

    // :: [OPTION 2]
    //    This will require that a Cognito Identity Pool is integrated
    //    with your Cognito User Pool.
    const onSuccessAwsFederate = (result) => {
      const token = result.getAccessToken().getJwtToken()

      // :: -----------------
      // :: this really only matters if we're using the aws-sdk
      //    after this operation
      const loginkey = `cognito-idp.${process.env.APP_AWS_REGION}.amazonaws.com/${process.env.APP_COGNITO_USERPOOL_ID}`
      const loginvalue = result.getIdToken().getJwtToken()

      AWS.config.region = process.env.APP_AWS_REGION || 'ap-southeast-1'
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: process.env.APP_COGNITO_IDENTITYPOOL_ID,
        Logins: {
          [loginkey]: loginvalue,
        },
      })

      AWS.config.credentials.refresh((err) => {
        if (err)
          return reject({
            statusCode: 400,
            body: err.message || JSON.stringify(err),
          })

        // :: ---
        resolve({
          statusCode: 200,
          body: `Authenticated to the AWS SDK: ${username}`,
        })
      })
    }

    const onFailure = (err) => {
      return reject({
        statusCode: 400,
        body: err.message || JSON.stringify(err),
      })
    }

    // :: [NOTE]
    //    Change the onSuccess function depending on whether you only
    //    want the JWT token from Cognito, or if you want to use the Cognito
    //    process to federate the user to AWS as well (through the AWS-SDK)
    // const onSuccess = onSuccessTokenOnly
    const onSuccess = onSuccessAwsFederate

    user.authenticateUser(authdetails, { onSuccess, onFailure })
  })

  return task
}
