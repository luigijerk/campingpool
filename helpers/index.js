var helper = {};

var formatDateTime = function(dateString) {
  var date = dateString.split(/[- :]/);
  return date[1] + '/' + date[2] + '/' + date[0];
};
helper.formatDateTime = formatDateTime;

module.exports = helper;