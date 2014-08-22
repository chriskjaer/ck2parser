var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    path = require('path'),
    should = chai.should(),
    ck2parser = require('../');

chai.use(chaiAsPromised);

var SAVEFILE = path.join(__dirname, 'testSave.ck2'),
    characters = ck2parser(SAVEFILE);


describe('Parser promise:', function () {
  it('should return an array', function () {
    return characters.should.eventually.be.an('array');
  });

  it('should reject promise if passed a wrong path or file', function () {
    return ck2parser('wrongPath').should.eventually.be.rejected;
  });

  describe('Each array should contain: ', function () {
    var character = [];

    beforeEach(function () {
      return characters.then(function (result) {
        character = result[4000];
      });
    });

    it('an age key with a number', function () {
      character.should.contain.keys('age');
      character.age.should.be.a('number');
    });

    it('a culture key with a string', function () {
      character.should.contain.keys('culture');
      character.culture.should.be.a('string');
    });

    it('a religion key with a string', function () {
      character.should.contain.keys('religion');
      character.religion.should.be.a('string');
    });

    it('a birth_name key with a string', function () {
      character.should.contain.keys('birth_name');
      character.birth_name.should.be.a('string');
    });

    it('a health key with a number', function () {
      character.should.contain.keys('health');
      character.health.should.satisfy(function (number) { return parseFloat(number); });
    });

    it('a fertility key with a number', function () {
      character.should.contain.keys('fertility');
      character.fertility.should.satisfy(function (number) { return parseFloat(number); });
    });

    it('a traits array', function () {
      character.traits.should.be.an('array');
    });

    it('a birth_date key with a valid date', function () {
      character.should.contain.keys('birth_date');
      character.birth_date.should.satisfy(
        function (date) { 
          if (new Date(date) == 'Invalid Date') {
            return false;
          } else {
            return true;
          }
        });
    });

    it('an attributes key with an array of 5 items', function () {
      character.should.contain.keys('attributes');
      character
        .attributes.should.be.an('array')
        .and.have.length.of(5);
    });
  });
});

