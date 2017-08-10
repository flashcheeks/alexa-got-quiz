# Alexa + Serverless template

> Template for building an Alexa Skill using Serverless

## Requirements

- Node.js installed globally on your machine
- Serverless installed globally on your machine
- Access to an Amazon Web Services account


## Usage

This is a [Serverless](https://serverless.com/) app for AWS Lambda. 

Copy `.env.sample.json` to `.env.json` and fill in the values.

For Lambda, `handler.js` handles core requests and passes them to the main app in `app/main.js`. You can run this locally without Lambda by using the `tester.js`. Build an Alexa JSON object in that file, and run it as follows:

    $ npm run demo


## Deployment

The skill is deployed to AWS Lambda via Serverless. Configure Serverless in the `serverless.yml` file, and deploy by running:

    $ npm run deploy

_See the Serverless docs for additional deployment commands._


## Testing

The skill contains unit tests that can be run with Mocha:

    $ npm run test

Istanbul will generate code coverage, which can be found in the `/coverage` directory after running the above command.