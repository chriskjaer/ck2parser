var fs = require('q-io/fs');
var moment = require('moment');

module.exports = function (file) {
  var extractChars = /(?:\t\bcharacter=\n\t\{\n)([\S\s]+?\n\t\})/gm;
  var extractIndividualChars = /(?:\t{2}\d+?=[^]+?)(?=\n\t{2}\})/gm;
  var extractCurrentDate = /(\n\tdate=")(.+)(?=")/g;

  function splitString(obj, string) {
    if (obj[string]) {
      obj[string] = obj[string].split(' ');
    }
  }

  return fs.read(file)
    .then(function (data) {
      var currentDate = moment(new Date(extractCurrentDate.exec(data)[2])); // Get current date and pass it to moment.js
      var chars = data.match(extractChars)[0];
      var charsArray = chars.match(extractIndividualChars);
      var livingChars = [];

      charsArray.map(function (char) {
        var charAlive = !char.match(/\bdeath_date/gm);
        if (charAlive) livingChars.push(char);
      });

      livingChars = livingChars.map(function (char) {
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
            var value = line.split(': ');
            var keyValue = {};

            keyValue[value[0]] = value[1];

            return keyValue;
          })
          .reduce(function (obj, key) {    // Convert Objects to single object
            var k = Object.keys(key)[0];
            obj[k] = key[k];

            return obj;
          });

        splitString(char, 'attributes');
        splitString(char, 'traits');
        char.age = currentDate.diff(new Date(char.birth_date), 'years');

        return char;
      });

      return livingChars;
    })
    .catch(function (error) {
      throw error;
    });
};
