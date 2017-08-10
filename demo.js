const handler = require('./handler');

// Place the Alexa testing JSON here

const json = `{
  "session": {
    "sessionId": "SessionId.1cb555b5-a075-42ef-a7fc-5d6abeaf2c12",
    "application": {
      "applicationId": "amzn1.ask.skill.a39aa5c1-f387-4c6c-9763-8e738f951ee2"
    },
    "attributes": {},
    "user": {
      "userId": "amzn1.ask.account.AE4LIJCPJZMVJGBHWOQNEVGX7ZAROTNJJAQ2K6RJE24PFWZABXQ7HTVEGPC5C5TWLAGBS3LJARDRYTXLTS5HSMVQ3FU4AIVIL72IHZBBR4MX77Y7Z6QDIF55JIX2M6CF7JZROHDXWIPUGTIPUCUD6UNCBIHDY7U7X43YJBYDWCAP2OTQMPMTS3EGVPMANQJEFDIPU4ZK7EHKDFI"
    },
    "new": false
  },
  "request": {
    "type": "IntentRequest",
    "requestId": "EdwRequestId.f703241b-7deb-40f1-b4e0-550f7e6367d5",
    "locale": "en-GB",
    "timestamp": "2017-08-08T20:22:39Z",
    "intent": {
      "name": "CatchAllIntent",
      "slots": {
        "CatchAll": {
          "name": "CatchAll",
          "value": "mandon Moore"
        }
      }
    }
  },
  "version": "1.0"
}`;

// This will run the Alexa testing code through the handler and log the output to the console
handler.handler(JSON.parse(json), {}, (err, res) => {
  if (err) {
    console.log('[ERR]', err);
  } else {
    console.log(res);
  }
});
