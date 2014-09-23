'use strict';
var chai           = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    path           = require('path'),
    should         = chai.should(),
    parse          = require('./../lib/');

chai.use(chaiAsPromised);

var SAVEFILE   = path.join(__dirname, 'testSave.ck2');
var parsedFile = parse(SAVEFILE);

describe('Parser promise:', function () {
  it('should return a promise', function () {
    this.timeout(10000);
    return parsedFile.should.be.fulfilled;
  });

  it('should reject promise if passed a wrong path or file', function () {
    return parse('./wrong-path/foo.txt').should.eventually.be.rejected;
  });

  describe('The promise should contain: ', function () {
    it('a version number', function () {
      return parsedFile.should.eventually.have.property('version');
    });

    it('a player property', function () {
      return parsedFile.should.eventually.have.property('player');
    });

    it('a dynasty propery', function () {
      return parsedFile.should.eventually.have.property('dynasties');
    });

    it('a character property', function () {
      return parsedFile.should.eventually.have.property('character');
    });
  });
});

