'use strict';

var fs     = require('q-io/fs'),
    parse  = require('./parser').everything;

module.exports = function (file) {
  return fs.read(file)
    .then(function(data) {
      return parse(data);
    })
    .catch(function (error) {
      throw error;
    });
};
