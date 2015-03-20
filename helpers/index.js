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

module.exports = helper;