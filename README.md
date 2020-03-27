# cognito-integration-demo

A collection of functions to demo how to communicate with [Amazon Cognito][1],
also available through a CLI.

Functions are also packaged to be deployable as [AWS Lambda][2] functions
using the [Serverless Framework][3].

The demo snippets are largely adapted versions of the snippets provided by [`amazon-cognito-identity-js`][4],
which this codebase uses.

## Installation

```
npm install -g @richardneililagan/cognito-integration-demo
```

You will need to prepare an Amazon Cognito User Pool yourself.

The package will look for the following environment variables:

- `APP_COGNITO_USERPOOL_ID` - The ID of an Amazon Cognito User Pool
- `APP_COGNITO_USERPOOL_CLIENT_ID` - The ID of a client authorized to talk with the User Pool above
- `APP_AWS_REGION` - The AWS region where your User Pool is.

- `APP_COGNITO_IDENTITYPOOL_ID` - (optional) The ID of an Amazon Cognito Identity Pool, configured to accept federation from the User Pool above. **Only required if you want to demo authentication against the AWS SDK**.

## Usage

The CLI is available through `cognito` if installed globally via `npm`.
Run `cognito help` for more info on the operations.

e.g.

```
cognito register-user myuser hunter2 no-reply@domain.com +6512345678
```

The actual logic is found in the `src/handlers/` directory.
I've done my best to make sure the functions are as autonomous as possible from each other,
so that the actual flow across each one is (hopefully) clearer.

## Deploying as a Serverless package

The codebase is also written so that it is deployable via the [Serverless Framework][3].
See the `serverless.yaml` file for more details on the routes.

## License

MIT

---

[@techlifemusic][5]

[1]: https://aws.amazon.com/cognito
[2]: https://aws.amazon.com/lambda
[3]: https://serverless.com
[4]: https://www.npmjs.com/package/amazon-cognito-identity-js
[5]: https://twitter.com/techlifemusic
