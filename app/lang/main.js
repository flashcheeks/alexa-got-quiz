module.exports = language => {
  // load in the strings for the supplied language
  const strings = require('./' + language);

  // return an object that returns either the matching string,
  // or the supplied key if no matching string is found
  return {
    get: (key, data) => {
      // if no matching string is found, return the key
      if (typeof strings[key] === 'undefined') {
        return key;
      }

      // return the matching string
      return strings[key](data);
    },
  };
};
