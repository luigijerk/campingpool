//var util = require('util');
var statbookModel = require('../models/statbook');
var model = {};

var getPlayersArray = function(season) {
  var matches = statbookModel.getMatchesArray(season);
  var names = [];
  for (var i = 0; i < matches.length; i++) {
    if (names.indexOf(matches[i].player_a) < 0) {
      names.push(matches[i].player_a);
    }
    if (names.indexOf(matches[i].player_b) < 0) {
      names.push(matches[i].player_b);
    }
  }
  return names;
};
model.getPlayersArray = getPlayersArray;

var getYearsArray = function(season) {
  var years = [];
  for (var i = 0; i < season.length; i++) {
    years.push(season[i].year);
  }
  return years;
};
model.getYearsArray = getYearsArray;

var isSuccessfulQuery = function(params) {
  if (typeof params.player !== 'undefined') {
    return params.player.length > 0;
  }
  return false;
};
model.isSuccessfulQuery = isSuccessfulQuery;

var getResultsMessage = function(params) {
  var message = 'Enter a new search';

  if (typeof params.search_type !== 'undefined') {
    if (typeof params.player === 'undefined') {
      message = 'No players selected! Enter a new search';
    } else if (typeof params.opponent === 'undefined' && params.toggle_opponent == 1) {
      message = 'No opponents selected! Enter a new search';
    } else if (parseInt(params.week_start) > parseInt(params.week_end)) {
      message = 'You cannot set the ending week before the starting week! Enter a new search'
    } else if (parseInt(params.year_start) > parseInt(params.year_end)) {
      message = 'You cannot set the ending year before the starting year! Enter a new search'
    } else {
      message = 'Displaying ';
      switch (params.search_type) {
        case 'points':
          message += 'points';
          break;
        case 'points_against':
          message += 'points against';
          break;
        case 'record':
          message += 'record';
          break;
      }
      message += ' from week ' + params.week_start + ' to ' + params.week_end + ' in ' + params.year_start + ' to ' + params.year_end;
      if (params.toggle_opponent == 1) {
        message += ' vs. ';
        for (var i = 0; i < params.opponent.length; i++) {
          message +=  params.opponent[i];
          if (i < params.opponent.length - 1) {
            message += ', ';
          }
        }
      }
      if (params.margin == 1) {
        message += ' in games decided by';
        if (parseFloat(params.min_marg) > parseFloat(params.max_marg)) {
          message = 'You cannot set the minimum margin above the maximum margin! Enter a new seatch';
        }
        else {
          if (params.min_marg > 0) {
            message += ' more than ' + params.min_marg + ' and ';
          }
          message += ' less than ' + params.max_marg;
        }
      }
    }
  }
  message += '.';
  return message;
};
model.getResultsMessage = getResultsMessage;

var getResultSet = function(params, season) {
  var resultSet = [];
  if (params.search_type == 'points') {
    resultSet = getPointsResults(params, season);
  } else if (params.search_type == 'points_against') {
    resultSet = getPointsAgainstResults(params, season);
  } else if (params.search_type == 'record') {
    resultSet = getRecordResults(params, season);
  }
  resultSet.sort(sortAverage);
  return resultSet;
};
model.getResultSet = getResultSet;

var getTableHeading = function(params) {
  if (params.search_type == 'record') {
    return ['Player', 'Record', 'Win %'];
  } else {
    return ['Player', 'Points', 'Points/Game'];
  }
};
model.getTableHeading = getTableHeading;

function getPointsResults(params, season) {
  var matches = statbookModel.getMatchesArray(season);
  var results = [];
  var fits = true; // keeps track of all optional parameters being met
  for (var i = 0; i < params.player.length; i++) {
    results[i] = {
      name: params.player[i],
      total: 0,
      average: 0,
      games: 0
    };
    for (var j = 0; j < matches.length; j++) {
      if (matches[j].player_a == results[i].name) {
        fits = true;
        if (fits && params.toggle_opponent == 1) {
          fits = vsOpponent(params.opponent, matches[j].player_b);
        }
        if (fits) {
          fits = inWeek(params.week_start, params.week_end, matches[j].week);
        }
        if (fits) {
          fits = inYear(params.year_start, params.year_end, matches[j].year);
        }
        if (fits) {
          results[i].total += parseFloat(matches[j].score_a);
          results[i].games++;
        }
      } else if (matches[j].player_b === results[i].name) {
        fits = true;
        if (fits && params.toggle_opponent == 1) {
          fits = vsOpponent(params.opponent, matches[j].player_a);
        }
        if (fits) {
          fits = inWeek(params.week_start, params.week_end, matches[j].week);
        }
        if (fits) {
          fits = inYear(params.year_start, params.year_end, matches[j].year);
        }
        if (fits) {
          results[i].total += parseFloat(matches[j].score_b);
          results[i].games++;
        }
      }
    }
    var games = results[i].games == 0 ? 1 : results[i].games;
    results[i].average = (results[i].total / games).toFixed(2);
    results[i].total = results[i].total.toFixed(2);
  }
  return results;
}

function getPointsAgainstResults(params, season) {
  var matches = statbookModel.getMatchesArray(season);
  var results = [];
  var fits = true; // keeps track of all optional parameters being met
  for (var i = 0; i < params.player.length; i++) {
    results[i] = {
      name: params.player[i],
      total: 0,
      average: 0,
      games: 0
    };
    for (var j = 0; j < matches.length; j++) {
      if (matches[j].player_a == results[i].name) {
        fits = true;
        if (fits && params.toggle_opponent == 1) {
          fits = vsOpponent(params.opponent, matches[j].player_b);
        }
        if (fits) {
          fits = inWeek(params.week_start, params.week_end, matches[j].week);
        }
        if (fits) {
          fits = inYear(params.year_start, params.year_end, matches[j].year);
        }
        if (fits) {
          results[i].total += parseFloat(matches[j].score_b);
          results[i].games++;
        }
      } else if (matches[j].player_b === results[i].name) {
        fits = true;
        if (fits && params.toggle_opponent == 1) {
          fits = vsOpponent(params.opponent, matches[j].player_a);
        }
        if (fits) {
          fits = inWeek(params.week_start, params.week_end, matches[j].week);
        }
        if (fits) {
          fits = inYear(params.year_start, params.year_end, matches[j].year);
        }
        if (fits) {
          results[i].total += parseFloat(matches[j].score_a);
          results[i].games++;
        }
      }
    }
    var games = results[i].games == 0 ? 1 : results[i].games;
    results[i].average = (results[i].total / games).toFixed(2);
    results[i].total = results[i].total.toFixed(2);
  }
  return results;
}

function getRecordResults(params, season) {
  var matches = statbookModel.getMatchesArray(season);
  var results = [];
  var fits = true; // keeps track of all optional parameters being met
  for (var i = 0; i < params.player.length; i++) {
    results[i] = {
      name: params.player[i],
      total: '',
      average: 0,
      games: 0,
      win: 0,
      lose: 0,
      draw: 0
    };
    for (var j = 0; j < matches.length; j++) {
      if (matches[j].player_a == results[i].name) {
        fits = true;
        if (fits && params.toggle_opponent == 1) {
          fits = vsOpponent(params.opponent, matches[j].player_b);
        }
        if (fits) {
          fits = inWeek(params.week_start, params.week_end, matches[j].week);
        }
        if (fits) {
          fits = inYear(params.year_start, params.year_end, matches[j].year);
        }
        if (fits && params.margin == 1) {
          fits = inMargin(params.min_marg, params.max_marg, matches[j].score_a, matches[j].score_b);
        }
        if (fits) {
          results[i].games++;
          if (parseFloat(matches[j].score_a) > parseFloat(matches[j].score_b)) {
            results[i].win++;
          } else if (parseFloat(matches[j].score_a) < parseFloat(matches[j].score_b)) {
            results[i].lose++;
          } else {
            results[i].draw++;
          }
        }
      } else if (matches[j].player_b === results[i].name) {
        fits = true;
        if (fits && params.toggle_opponent == 1) {
          fits = vsOpponent(params.opponent, matches[j].player_a);
        }
        if (fits) {
          fits = inWeek(params.week_start, params.week_end, matches[j].week);
        }
        if (fits) {
          fits = inYear(params.year_start, params.year_end, matches[j].year);
        }
        if (fits && params.margin == 1) {
          fits = inMargin(params.min_marg, params.max_marg, matches[j].score_a, matches[j].score_b);
        }
        if (fits) {
          results[i].games++;
          if (parseFloat(matches[j].score_b) > parseFloat(matches[j].score_a)) {
            results[i].win++;
          } else if (parseFloat(matches[j].score_b) < parseFloat(matches[j].score_a)) {
            results[i].lose++;
          } else {
            results[i].draw++;
          }
        }
      }
    }
    var games = results[i].games == 0 ? 1 : results[i].games;
    results[i].average = ((results[i].win + 0.5 * results[i].draw) / games * 100).toFixed(1);
    if (results[i].draw > 0) {
      results[i].total = results[i].win + '-' + results[i].lose + '-' + results[i].draw;
    } else {
      results[i].total = results[i].win + '-' + results[i].lose;
    }
  }
  return results;
}

function vsOpponent(opponents, player) {
  for (var k = 0; k < opponents.length; k++) {
    if (player == opponents[k]) {
      return true;
    }
  }
  return false;
}

function inWeek(week_start, week_end, week) {
  return (parseInt(week) >= parseInt(week_start) && parseInt(week) <= parseInt(week_end));
}

function inYear(year_start, year_end, year) {
  return (parseInt(year) >= parseInt(year_start) && parseInt(year) <= parseInt(year_end));
}

function inMargin(min_marg, max_marg, score_a, score_b) {
  var margin = Math.abs(parseFloat(score_a) - parseFloat(score_b));
  return (margin >= parseFloat(min_marg) && margin <= parseFloat(max_marg));
}

function sortAverage(a,b) {
  if (parseFloat(a.average) > parseFloat(b.average)) return -1;
  if (parseFloat(a.average) < parseFloat(b.average)) return 1;
  return 0;
}

module.exports = model;