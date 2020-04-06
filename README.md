# cognito-integration-demo

A collection of functions that demonstrate how to communicate with [Amazon Cognito][1],
meant to be a proof-of-concept (POC) and/or a simple reference.

As part of the POC, this package includes a CLI client that consumes the functions above.
The package also comes with a manifest for the [Serverless Framework][3], so you can deploy the functions
as a set of HTTPS API endpoints behind an [Amazon API Gateway][6].

The demo snippets are largely adapted versions of the snippets provided by [`amazon-cognito-identity-js`][4],
which this codebase uses.

## About

The functions that demonstrate Cognito functionality are all stored in the `src/handlers/` folder.
Everything else is mostly just to build the CLI and/or Serverless Framework functionality around it.

If you're only interested in checking out how to talk to Cognito from your code,
then all you'll need are the files in `src/handlers/`. They're written in such a way so that
the logic in each handler is pretty much self-supporting, with not much dependencies between each other. (Ultimately, this means that the code can be made better in real use-case environments.)

---

## Installation

If you want to try out the CLI for yourself, you can just clone this repository and run `npm link` to make
the CLI tool available on your `PATH`, or you can install the release package directly from `npm`:

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

The CLI is available through the `cognito` command if installed globally via `npm` or the codebase is made available
using `npm link`.

```
cognito
```

The available CLI options change depending on the CLI state.
(E.g. if you're logged in or not.)

Again, the actual logic is found in the `src/handlers/` directory.
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
[6]: https://aws.amazon.com/api-gateway
