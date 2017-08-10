module.exports = {
  please: data => `Please`,

  continue: data => `Say "continue" to carry on your previous game. Or`,

  start: data => `Say "start" to begin a new game.`,

  question: data => `Question`,

  correct: data => `Correct.`,
  incorrect: data => `Incorrect.`,

  next: data => {
    const items = [
      `Let's move on to the next question.`,
      `Next question.`,
      `Here is the next question.`,
      `Let's carry on.`,
    ];
    return items[Math.floor(Math.random() * items.length)];
  },

  finished: data =>
    `Well done, you have completed all the questions. Let's see how you did.`,

  repeat: data => `Just say "repeat" to hear the question again.`,

  reprompt: data => `Can I help you with anything else?`,

  help: data =>
    `You can say "start a new game" to begin the quiz. You will then be asked a series of questions. Answer them all to complete the quiz. If you need to hear a question again just say "repeat the question". You will find out your score at the end of the quiz. Enjoy.`,

  progress: data => `Your progress has been saved.`,

  stop: data => `Thanks for playing. Goodbye.`,

  unknown: data =>
    `Sorry an error has occurred. Please try restarting the quiz.`,

  setError: data =>
    `Sorry an error has occurred. It has not been possible to store your progress. Please try re-starting the quiz.`,

  getError: data =>
    `Sorry an error has occurred. It has not been possible to retrieve your progress. Please try re-starting the quiz.`,
};
