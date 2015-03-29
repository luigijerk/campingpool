//var util = require('util');
var helper = require('../helpers');
var model = {};

var getPlayers = function(season) {
  var playersObjectArray = getPlayerObjectArray(season);
  populatePlayerRecord(playersObjectArray, season);
  populatePlayerWinPercentage(playersObjectArray);
  populatePlayerMiscStats(playersObjectArray, season);
  populatePlayerPoints(playersObjectArray, season);
  populatePlayerPointsAllowed(playersObjectArray, season);
  populateAdjustedRatios(season);
  populateAdjustedPoints(playersObjectArray, season);
  populateAdjustedPointsAllowed(playersObjectArray, season);
  return playersObjectArray;
};
model.getPlayers = getPlayers;

var populateAdjustedRatios = function(season) {
  for (var i = 0; i < season.length; i++) {
    season[i].pointsTotal = 0;
  }
  for (var j = 0; j < season.length; j++) {
    for (var k = 0; k < season[j].matches.length; k++) {
      season[j].pointsTotal += parseFloat(season[j].matches[k].score_a);
      season[j].pointsTotal += parseFloat(season[j].matches[k].score_b);
    }
  }
  for (var l = 0; l < season.length; l++) {
    season[l].pointsTeamAverageSeason = season[l].pointsTotal / season[l].players.length;
  }
  var totalAverage = 0;
  for (var n = 0; n < season.length; n++) {
    totalAverage += season[n].pointsTeamAverageSeason;
  }
  var pointsTeamAverageSeason = totalAverage / season.length;
  for (var m = 0; m < season.length; m++) {
    season[m].adjustedRatio = pointsTeamAverageSeason / season[m].pointsTeamAverageSeason;
  }
};
model.populateAdjustedRatios = populateAdjustedRatios;

function getMatchesArray(season) {
  var matches = [];
  for (var i = 0; i < season.length; i++) {
    for (var j = 0; j < season[i].matches.length; j++)
    matches.push(season[i].matches[j]);
  }
  return matches;
}
model.getMatchesArray = getMatchesArray;

function getPlayerObjectArray(season) {
  var matches = getMatchesArray(season);
  var names = [];
  for (var i = 0; i < matches.length; i++) {
    if (names.indexOf(matches[i].player_a) < 0) {
      names.push(matches[i].player_a);
    }
    if (names.indexOf(matches[i].player_b) < 0) {
      names.push(matches[i].player_b);
    }
  }
  var nameObjs = [];
  for (var j = 0; j < names.length; j++) {
    nameObjs[j] = {
      name: names[j],
      win: 0,
      lose: 0,
      draw: 0,
      games: 0,
      seasons: 0,
      points: 0,
      pointsAverageWeek: 0,
      pointsAllowed: 0,
      pointsAllowedAverageWeek: 0,
      aPoints: 0,
      aPointsAverageWeek: 0,
      aPointsAllowed: 0,
      aPointsAllowedAverageWeek: 0,
      rankTotal: 0,
      rankAverage: 0,
      transactions: 0,
      transactionsAverageYear: 0
    };
  }
  return nameObjs;
}

function populatePlayerRecord(players, season) {
  var matches = getMatchesArray(season);
  var win_a, win_b, draw;
  for (var j = 0; j < matches.length; j++) {
    if (parseFloat(matches[j].score_a) > parseFloat(matches[j].score_b)) {
      win_a = 1;
      win_b = 0;
      draw = 0;
    } else if (parseFloat(matches[j].score_a) < parseFloat(matches[j].score_b)) {
      win_a = 0;
      win_b = 1;
      draw = 0;
    } else {
      win_a = 0;
      win_b = 0;
      draw = 1;
    }
    for (var k = 0; k < players.length; k++) {
      if (matches[j].player_a == players[k].name) {
        players[k].win += win_a;
        players[k].lose += win_b;
        players[k].draw += draw;
        players[k].games++;
      } else if (matches[j].player_b == players[k].name) {
        players[k].win += win_b;
        players[k].lose += win_a;
        players[k].draw += draw;
        players[k].games++;
      }
    }
  }
}

function populatePlayerWinPercentage(players) {
  for (var i = 0; i < players.length; i++) {
    var games = players[i].games == 0 ? 1 : players[i].games;
    players[i].percentage = ((players[i].win + 0.5 * players[i].draw) / games * 100).toFixed(1);
  }
}

function populatePlayerMiscStats(players, season) {
  for (var i = 0; i < season.length; i++) {
    for (var j = 0; j < season[i].players.length; j++) {
      for (var k = 0; k < players.length; k++) {
        if (season[i].players[j].name == players[k].name) {
          players[k].seasons++;
          players[k].rankTotal += parseInt(season[i].players[j].rank);
          players[k].transactions += parseInt(season[i].players[j].transactions);
        }
      }
    }
  }
  for (var l = 0; l < players.length; l++) {
    players[l].rankAverage = (players[l].rankTotal / players[l].seasons).toFixed(1);
    players[l].transactionsAverageYear = (players[l].transactions / players[l].seasons).toFixed(1);
  }
}

function populatePlayerPoints(players, season) {
  var matches = getMatchesArray(season);
  for (var j = 0; j < matches.length; j++) {
    for (var k = 0; k < players.length; k++) {
      if (matches[j].player_a == players[k].name) {
        players[k].points += parseFloat(matches[j].score_a);
      } else if (matches[j].player_b == players[k].name) {
        players[k].points += parseFloat(matches[j].score_b);
      }
    }
  }
  for (var i = 0; i < players.length; i++) {
    var games = players[i].games == 0 ? 1 : players[i].games;
    players[i].pointsAverageWeek = (players[i].points / games).toFixed(2);
    players[i].points = players[i].points.toFixed(2);
  }
}

function populatePlayerPointsAllowed(players, season) {
  var matches = getMatchesArray(season);
  for (var j = 0; j < matches.length; j++) {
    for (var k = 0; k < players.length; k++) {
      if (matches[j].player_a == players[k].name) {
        players[k].pointsAllowed += parseFloat(matches[j].score_b);
      } else if (matches[j].player_b == players[k].name) {
        players[k].pointsAllowed += parseFloat(matches[j].score_a);
      }
    }
  }
  for (var i = 0; i < players.length; i++) {
    var games = players[i].games == 0 ? 1 : players[i].games;
    players[i].pointsAllowedAverageWeek = (players[i].pointsAllowed / games).toFixed(2);
    players[i].pointsAllowed = players[i].pointsAllowed.toFixed(2);
  }
}

function populateAdjustedPoints(players, season) {
  for (var l = 0; l < season.length; l++) {
    for (var j = 0; j < season[l].matches.length; j++) {
      for (var k = 0; k < players.length; k++) {
        if (season[l].matches[j].player_a == players[k].name) {
          players[k].aPoints += parseFloat(season[l].matches[j].score_a) * season[l].adjustedRatio;
        } else if (season[l].matches[j].player_b == players[k].name) {
          players[k].aPoints += parseFloat(season[l].matches[j].score_b) * season[l].adjustedRatio;
        }
      }
    }
  }
  for (var i = 0; i < players.length; i++) {
    var games = players[i].games == 0 ? 1 : players[i].games;
    players[i].aPointsAverageWeek = (players[i].aPoints / games).toFixed(2);
    players[i].aPoints = players[i].aPoints.toFixed(2);
  }
}

function populateAdjustedPointsAllowed(players, season) {
  for (var l = 0; l < season.length; l++) {
    for (var j = 0; j < season[l].matches.length; j++) {
      for (var k = 0; k < players.length; k++) {
        if (season[l].matches[j].player_a == players[k].name) {
          players[k].aPointsAllowed += parseFloat(season[l].matches[j].score_b) * season[l].adjustedRatio;
        } else if (season[l].matches[j].player_b == players[k].name) {
          players[k].aPointsAllowed += parseFloat(season[l].matches[j].score_a) * season[l].adjustedRatio;
        }
      }
    }
  }
  for (var i = 0; i < players.length; i++) {
    var games = players[i].games == 0 ? 1 : players[i].games;
    players[i].aPointsAllowedAverageWeek = (players[i].aPointsAllowed / games).toFixed(2);
    players[i].aPointsAllowed = players[i].aPointsAllowed.toFixed(2);
  }
}

var getStandingsRows = function(season) {
  var standingsRows = [];
  var more = true;
  var rank = 1;
  while (more) {
    more = false;
    for (var i = 0; i < season.length; i++) {
      for (var j = 0; j < season[i].players.length; j++) {
        if (season[i].players[j].rank == rank) {
          if (typeof standingsRows[rank-1] === 'undefined') {
            standingsRows[rank - 1] = [];
          }
          if (typeof standingsRows[rank-1][i] === 'undefined') {
            standingsRows[rank - 1][i] = [];
          }
          standingsRows[rank - 1][i] = helper.getShortName(season[i].players[j].name);
          more = true;
        }
      }
    }
    rank++;
  }
  return standingsRows;
};
model.getStandingsRows = getStandingsRows;

module.exports = model;