'use strict';

// load env vars
const env = require('./.env.json');

// load the core app
const app = require('./app/main');

// validation methods all live in here
const validation = {
  isValidEvent: event => {
    try {
      return event.session.application.applicationId === env.applicationId;
    } catch (e) {
      return false;
    }
  },
};

module.exports.handler = (event, context, callback) => {
  // validate our event first
  if (!validation.isValidEvent(event)) {
    callback('Request made from invalid application');
    return;
  }

  // switch over the various request types Alexa provides
  switch (event.request.type) {
    case 'LaunchRequest':
      app.launch(event, callback);
      return;

    case 'IntentRequest':
      app.intent(event, callback);
      return;

    case 'SessionEndedRequest':
      return;
  }

  // if all else fails, send an empty response
  callback(null, {});
};
