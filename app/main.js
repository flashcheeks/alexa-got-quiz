'use strict';

// amazon sdk - set region
const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-west-1' });

// database client
const DynamoDB = new AWS.DynamoDB();

// language strings and helper
const FuzzySet = require('fuzzyset.js');
const lang = require('./lang/main')('en');

// quiz specific - data and table name
const quizData = require('./data/game-of-thrones.json');
const tableName = 'gotQuizTable';

/*
 * 
 * Language - getters
 * 
 */

const getContinueText = questionIndex => {
  return questionIndex > 0 ? lang.get('continue') : '';
};

const getFuzzyAnswer = (correct, match) => {
  const fuzzy = FuzzySet(correct);
  const results = fuzzy.get(match);
  const score = getFuzzyScore(results);
  const debug = { correct: correct, match: match, score: score };
  console.log(JSON.stringify(debug));
  return score >= 0.6 ? true : false;
};

const getFuzzyScore = items => {
  return Array.isArray(items) ? getMax(getFuzzyScores(items)) : 0;
};

const getFuzzyScores = array => {
  return array.map(obj => {
    return obj[0];
  });
};

/*
 * 
 * Quiz - getters
 * 
 */

const getLaunchText = () => {
  return quizData.launch;
};

const getBeginText = () => {
  return quizData.begin;
};

const getQuestionText = questionIndex => {
  const prefix = lang.get('question');
  const number = (questionIndex + 1).toString() + ',';
  const question = quizData.questions[questionIndex].question;
  return [prefix, number, question].join(' ');
};

const getAnswerText = questionIndex => {
  return quizData.questions[questionIndex].answer;
};

const getResultText = (questionIndex, correct) => {
  const obj = quizData.questions[questionIndex];
  const revealText = obj.hasOwnProperty('reveal') ? obj.reveal : '';
  const resultText = correct ? lang.get('correct') : lang.get('incorrect');
  return [resultText, revealText].join(' ');
};

const getQuestionLength = () => {
  return quizData.questions.length;
};

const getScoreText = score => {
  return quizData.score.replace('{{score}}', score);
};

/*
 * 
 * Intent - helpers
 * 
 */

const launchIntent = (data, callback) => {
  const questionIndex = parseInt(getNestedProperty(data, 'Item.question.N'));
  const launchText = getLaunchText();
  const pleaseText = lang.get('please');
  const continueText = getContinueText(questionIndex);
  const startText = lang.get('start');
  const text = [launchText, pleaseText, continueText, startText].join(' ');
  const repeat = [pleaseText, continueText, startText].join(' ');
  callback(null, getBasicResponse(text, repeat, false));
};

const startIntent = (data, callback) => {
  const beginText = getBeginText();
  const questionText = getQuestionText(0);
  const text = [beginText, questionText].join(' ');
  const repeat = lang.get('repeat');
  callback(null, getBasicResponse(text, repeat, false));
};

const continueIntent = (data, callback) => {
  const questionIndex = parseInt(getNestedProperty(data, 'Item.question.N'));
  const text = getQuestionText(questionIndex);
  const repeat = lang.get('repeat');
  callback(null, getBasicResponse(text, repeat, false));
};

const answerIntent = (data, callback) => {
  const resultText = getResultText(data.prevQuestion, data.isCorrect);
  const nextText = lang.get('next');
  const questionText = getQuestionText(data.newQuestion);
  const text = [resultText, nextText, questionText].join(' ');
  const repeat = lang.get('repeat');
  callback(null, getBasicResponse(text, repeat, false));
};

const resultIntent = (data, callback) => {
  const resultText = getResultText(data.prevQuestion, data.isCorrect);
  const finishedText = lang.get('finished');
  const scoreText = getScoreText(data.newScore);
  const stopText = lang.get('stop');
  const text = [resultText, finishedText, scoreText, stopText].join(' ');
  callback(null, getBasicResponse(text, '', true));
};

/*
 * 
 * Database - helpers
 * 
 */

const getLaunchProgress = (event, callback) => {
  const userId = getNestedProperty(event, 'session.user.userId');
  getFromDB(userId, function(err, data) {
    err ? errorIntent(err, 'getError', callback) : launchIntent(data, callback);
  });
};

const setStartProgress = (event, callback) => {
  const userId = getNestedProperty(event, 'session.user.userId');
  setToDB(userId, 0, 0, function(err, data) {
    err ? errorIntent(err, 'setError', callback) : startIntent(data, callback);
  });
};

const getContinueProgress = (event, callback) => {
  const userId = getNestedProperty(event, 'session.user.userId');
  getFromDB(userId, function(err, data) {
    err || Object.keys(data).length === 0
      ? errorIntent(err, 'getError', callback)
      : continueIntent(data, callback);
  });
};

const getAnswerProgress = (event, callback) => {
  const userId = getNestedProperty(event, 'session.user.userId');
  getFromDB(userId, function(err, data) {
    err || Object.keys(data).length === 0
      ? errorIntent(err, 'getError', callback)
      : checkAnswerProgress(data, event, callback);
  });
};

const checkAnswerProgress = (data, event, callback) => {
  const prevQuestion = parseInt(getNestedProperty(data, 'Item.question.N'));
  const newQuestion = prevQuestion + 1;
  newQuestion < getQuestionLength()
    ? setAnswerProgress(data, event, callback)
    : setResultProgress(data, event, callback);
};

const setAnswerProgress = (data, event, callback) => {
  const userId = getNestedProperty(event, 'session.user.userId');
  const obj = getAnswerObj(data, event);
  setToDB(userId, obj.newQuestion, obj.newScore, function(err, data) {
    err ? errorIntent(err, 'setError', callback) : answerIntent(obj, callback);
  });
};

const setResultProgress = (data, event, callback) => {
  const userId = getNestedProperty(event, 'session.user.userId');
  const obj = getAnswerObj(data, event);
  setToDB(userId, 0, 0, function(err, data) {
    err ? errorIntent(err, 'setError', callback) : resultIntent(obj, callback);
  });
};

const getAnswerObj = (data, event) => {
  const value = getNestedProperty(event, 'request.intent.slots.CatchAll.value');
  const prevQuestion = parseInt(getNestedProperty(data, 'Item.question.N'));
  const prevScore = parseInt(getNestedProperty(data, 'Item.score.N'));
  const answerText = getAnswerText(prevQuestion);
  const isCorrect = getFuzzyAnswer(answerText, value);
  return {
    prevQuestion: prevQuestion,
    newQuestion: prevQuestion + 1,
    isCorrect: isCorrect,
    newScore: isCorrect ? prevScore + 1 : prevScore,
  };
};

/*
 * 
 * Handler modules
 * 
 */

module.exports = {
  launch: function(event, callback) {
    getLaunchProgress(event, callback);
  },

  intent: function(event, callback) {
    const intent = getNestedProperty(event, 'request.intent.name');
    switch (intent) {
      //
      case 'StartIntent':
      case 'AMAZON.StartOverIntent':
        setStartProgress(event, callback);
        return;

      case 'ContinueIntent':
      case 'RepeatIntent':
      case 'AMAZON.ResumeIntent':
      case 'AMAZON.RepeatIntent':
        getContinueProgress(event, callback);
        return;

      case 'CatchAllIntent':
        getAnswerProgress(event, callback);
        return;

      case 'AMAZON.CancelIntent':
      case 'AMAZON.PauseIntent':
        cancelIntent(event, callback);
        return;

      case 'AMAZON.HelpIntent':
        helpIntent(event, callback);
        return;

      case 'AMAZON.StopIntent':
        stopIntent(event, callback);
        return;

      default:
        unknownIntent(event, callback);
        return;
    }
  },
};

/*
 * 
 * Database - getters and setters
 * 
 */

const setToDB = (userId, question, score, callback) => {
  const dynamoParams = {
    Item: {
      userId: { S: userId.toString() },
      question: { N: question.toString() },
      score: { N: score.toString() },
    },
    TableName: tableName,
  };
  DynamoDB.putItem(dynamoParams, callback);
};

const getFromDB = (userId, callback) => {
  const dynamoParams = {
    Key: { userId: { S: userId } },
    TableName: tableName,
  };
  DynamoDB.getItem(dynamoParams, callback);
};

/*
 * 
 * Intent - built in helpers
 * 
 */

const cancelIntent = (event, callback) => {
  const progressText = lang.get('progress');
  const pleaseText = lang.get('please');
  const continueText = getContinueText(1);
  const startText = lang.get('start');
  const text = [progressText, pleaseText, continueText, startText].join(' ');
  const repeat = [pleaseText, continueText, startText].join(' ');
  callback(null, getBasicResponse(text, repeat, false));
};

const helpIntent = (event, callback) => {
  const text = lang.get('help');
  callback(null, getBasicResponse(text, text, false));
};

const stopIntent = (event, callback) => {
  const text = lang.get('stop');
  callback(null, getBasicResponse(text, '', true));
};

const unknownIntent = (event, callback) => {
  const text = lang.get('unknown');
  callback(null, getBasicResponse(text, '', false));
};

/*
 * 
 * Intent - errors
 * 
 */

const errorIntent = (err, messageStr, callback) => {
  console.log(err);
  const text = lang.get(messageStr);
  callback(null, getBasicResponse(text, '', false));
};

/*
 * 
 * Intent - responses
 * 
 */

const getBasicResponse = (text, reprompt, shouldEnd) => {
  return {
    version: '1.0',
    response: {
      outputSpeech: { type: 'PlainText', text: text },
      reprompt: { outputSpeech: { type: 'PlainText', text: reprompt } },
      shouldEndSession: shouldEnd,
    },
  };
};

/*
 * 
 * Helpers
 * 
 */

const getNestedProperty = (obj, props) => {
  return props.split('.').reduce(function(obj, prop) {
    return obj && obj.hasOwnProperty(prop) ? obj[prop] : null;
  }, obj);
};

const getMax = array => {
  return Math.max.apply(Math, array);
};
