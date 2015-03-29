//var util = require('util');
var helper = {};

var formatDateTime = function(dateString) {
  var date = dateString.split(/[- :]/);
  return date[1] + '/' + date[2] + '/' + date[0];
};
helper.formatDateTime = formatDateTime;

var hasNumbers = function(string) {
  return /[0-9]+/.test(string);
};
helper.hasNumbers = hasNumbers;

var getShortName = function(string) {
  var shortName = '';
  var firstName = string.match(/[A-Za-z]+/);
  if (firstName == 'Mike') {
    shortName = string.match(/[A-Z]/g).join('');
  } else if (firstName[0].length > 5) {
    shortName = firstName[0].substring(0,4);
  } else {
    shortName = firstName[0];
  }
  return shortName;
};
helper.getShortName = getShortName;

module.exports = helper;