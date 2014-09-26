'use strict';

var iconv  = require('iconv-lite'),
    fs     = require('q-io/fs'),
    parser = require('./parser');

iconv.extendNodeEncodings();

module.exports = function (file) {
  return fs.read(file, {charset: 'iso-8859-1' })
    .then(parser.checkIfCK2SaveFile)
    .then(parser.everything)
    .catch(function (error) {
      throw error;
    });
};
