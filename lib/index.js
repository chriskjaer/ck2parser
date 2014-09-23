'use strict';

var iconv  = require('iconv-lite'),
    fs     = require('q-io/fs'),
    parse  = require('./parser').everything;

iconv.extendNodeEncodings();

module.exports = function (file) {
  return fs.read(file, {charset: 'iso-8859-1' })
    .then(function(data) {
      return parse(data);
    })
    .catch(function (error) {
      throw error;
    });
};
