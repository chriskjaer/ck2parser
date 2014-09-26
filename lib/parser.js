'use strict';
var R = require('ramda');

var replace = R.invoker('replace', String.prototype);

var filetype = /^CK2txt/;

var replaceCurlyWithStartBracket = replace(/{\n/, '[');
var replaceCurlyWithEndBracket = replace(/\s?\t{2,}\}/, ']');
var replaceSpacesWithCommas = replace(/\s(?=\d)/g, ',');

var createArrayFromGroupOfNumbers = R.pipe(
  replaceCurlyWithStartBracket,
  replaceCurlyWithEndBracket,
  replaceSpacesWithCommas);

var parser = {
  checkIfCK2SaveFile: function(data) {
    if (!R.match(filetype, data)) {
      throw 'Not CK2 Savefile. Make sure compression is turned off';
    }
    return data;
  },

  replaceFiletypeWithStartCurly: replace(filetype, '{'),

  replaceEqualsWithColons: replace(/\=/g, ':'),

  wrapKeysInQuotes: replace(/\b(.)+?(?=\=)/g, function(match) {
    return '"' + match + '"';
  }),

  createArrays: replace(/(\{\n)+?([0-9]*\.?[0-9]*|\s)+(\s?\t{2,}\})/g,
    function(match) { return createArrayFromGroupOfNumbers(match);}
  ),

  moveCurliesOrBracketsToPreviousLine: replace(/(\n\t*)(?=\}|\{|\[)/g, ''),

  addCommas: replace(/([^\{\s]|\{\})$(?=\n\s)/gm, '$&,'),

  wrapValuesInQuotes: replace(/[a-z_]+?(?=\n)/ig, '"$&"'),

  convertToBooleans: replace(/("yes"|"no")(?=\n)/g, function(match) {
    return match === '"yes"' ? true : false;
  }),

  minify: replace(/(\n|\t)/g, ''),
};

parser.everything = R.pipe(
  parser.replaceFiletypeWithStartCurly,
  parser.wrapKeysInQuotes,
  parser.createArrays,
  parser.replaceEqualsWithColons,
  parser.wrapValuesInQuotes,
  parser.convertToBooleans,
  parser.moveCurliesOrBracketsToPreviousLine,
  parser.addCommas,
  parser.minify,
  JSON.parse
);

module.exports = parser;
