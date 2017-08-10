module.exports = {
  please: data => `Please`,

  continue: data => `Say "continue" to carry on your previous game. Or`,

  start: data => `Say "start" to begin a new game.`,

  question: data => `Question`,

  correct: data => `Correct.`,
  incorrect: data => `Incorrect.`,

  next: data => `Let's move on to the next question.`,
  //next: data => `Next question.`,
  //next: data => `Here is the next question.`,

  finished: data =>
    `Well done. You have completed all the questions. Let's see how you did.`,

  help: data => `Help.`,

  progress: data => `Your progress has been saved.`,

  stop: data => `Thanks for playing. Bye bye.`,

  unknown: data =>
    `Sorry an error has occurred. Please try restarting the quiz.`,

  setError: data =>
    `Sorry an error has occurred. It has not been possible to store your progress. Please try restarting the quiz.`,

  getError: data =>
    `Sorry an error has occurred. It has not been possible to retrieve your progress. Please try restarting the quiz.`,
};
