// Import chai.
const chai = require('chai');
const sinon = require('sinon');
const lang = require('../app/lang/main')('en');
const proxyquire = require('proxyquire');

// Tell chai that we'll be using the "should" style assertions.
const should = chai.should();

const app = require('../app/main');

describe('main', () => {

  describe('#launch()', () => {

    it('should keep the session open when triggered', (done) => {
      app.launch((err, res) => {
        res.response.shouldEndSession.should.be.false;
        done();
      });
    });

  });

  describe('#intent()', () => {

    /**
     * Your custom logic can be tested here
     it('should do something', (done) => {
  
     });
    */

  });

  // 

  /**
   * You can test any custom methods you write here
  describe('#yourCustomMethodName()', () => {
  
  });
  */

});