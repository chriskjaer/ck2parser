/* global describe, it, before */
'use strict';

var chai           = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    path           = require('path'),
    R              = require('ramda'),
    parse          = require('./../lib/'),
    should         = chai.should();

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

  describe('The promise should contain a: ', function () {
    it('version number', function () {
      return parsedFile.should.eventually.have.property('version');
    });

    it('player property', function () {
      return parsedFile.should.eventually.have.property('player');
    });

    it('dynasty propery', function () {
      return parsedFile.should.eventually.have.property('dynasties');
    });

    it('character property', function () {
      return parsedFile.should.eventually.have.property('character');
    });

    describe('Each character should contain a: ', function () {
      var characters = {};
      before(function () {
        parsedFile.then(function (data) {
          characters = data.character;
        });
      });

      var testableStringProps = [
        'birth_name',
        'birth_date',
        'religion',
        'culture',
        'dna',
        'properties'
      ];

      testableStringProps.map(function(prop) {
        it(prop + ' property', function () {
          R.mapObj(function (char) {
            char.should.have.property(prop);
            char[prop].should.be.a('string');
          }, characters);
        });
      });

      it('attributes array with 5 entries', function () {
        R.mapObj(function (char) {
          char.should.have.property('attributes');
          char.attributes.should.be.an('array').and.have.length(5);
        }, characters);
      });

    });
  });
});

