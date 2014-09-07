'use strict';

var fs     = require('q-io/fs'),
    moment = require('moment'),
    R      = require('ramda');

module.exports = function (file) {

  var getCharBlock = R.compose(R.head, R.match(/(?:\t\bcharacter=\n\t\{\n)([\S\s]+?\n\t\})/gm));

  // Get individual chars from a char block;
  var getIndividualChars = R.match(/(?:\t{2}\d+?=[^]+?)(?=\n\t{2}\})/gm);

  var getLivingChars = R.forEach(function (char) {
                          if (!char.match(/\bdeath_date/gm)) return char;
                        });

  var getChars = R.compose(getLivingChars,
                           getIndividualChars,
                           getCharBlock);

  var extractCurrentDate = /(\n\tdate=")(.+)(?=")/g;

  function splitString(obj, string) {
    if (obj[string]) {
      obj[string] = obj[string].split(' ');
    }
  }

  return fs.read(file)
    .then(function (data) {
                        // Get current date and pass it to moment.js
      var currentDate = moment(new Date(extractCurrentDate.exec(data)[2])),
          chars       = getChars(data);


      return chars.map(function (char) {
        char = char
          .replace(/=/g, ': ')             // Replace = with :
          .replace(/\byes(?=\n)/g, true)   // Convert all yes to true
          .replace(/\bno(?=\n)/g, false)   // Convert all no to false
          .replace(/\t\t(?!\t\s)/g, '')    // Clean up pre tabs
          .replace(/\n\t\b[a-z]+?:\s\n\t\{(\n\t[^]*?\n\t\}|\n\t[^]*?\})/g, '')  // Remove unused blocks for now (demesne/ledger)
          .replace(/[\s\S]+?\n\{\n/g, '')  // Remove CharID and trailing {
          .replace(/\n\t\{\n/g, '{')       // Make the {} go on the same line
          .replace(/\t/g, '')              // Remove Tabs
          .replace(/"|{| }/g,'')           // Remove unused chars
          .split('\n')                     // Finally some pretty lines ready to be split...
          .map(function (line) {           // Convert arrarys to objects
            return line.split(': ');
          });

        char = R.fromPairs(char);

        splitString(char, 'attributes');
        splitString(char, 'traits');
        char.age = currentDate.diff(new Date(char.birth_date), 'years');

        return char;
      });
    })
    .catch(function (error) {
      throw error;
    });
};
