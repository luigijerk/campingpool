var express = require('express');
var router = express.Router();
var statbookModel = require('../models/statbook');
var machineModel = require('../models/machine');

/* GET statbook page. */
router.get('/', function(req, res) {
  var db = req.db;
  db.collection('seasons').find().toArray(function (err, items) {
    var players = statbookModel.getPlayers(items);
    res.render('statbook', {
      "players" : players,
      "title" : "Statbook",
      "id" : "statbook",
      "slug" : "statbook",
      "subSlug" : "statbook"
    });
  });
});

/* GET machine page */
router.get('/machine', function(req, res) {
  var db = req.db;
  db.collection('seasons').find().toArray(function (err, items) {
    var playerNames = machineModel.getPlayersArray(items).sort();
    var years = machineModel.getYearsArray(items);
    var params = {
      "search_type" : req.query.search_type,
      "toggle_opponent" : req.query.toggle_opponent,
      "player" : req.query.player,
      "opponent" : req.query.opponent,
      "year_start" : req.query.year_start,
      "year_end" : req.query.year_end,
      "week_start" : req.query.week_start,
      "week_end" : req.query.week_end,
      "margin" : req.query.margin,
      "min_marg" : req.query.min_marg,
      "max_marg" : req.query.max_marg
    };
    var isSuccessfulQuery = machineModel.isSuccessfulQuery(params);
    var tableHeading = machineModel.getTableHeading(params);
    var resultsMessage = machineModel.getResultsMessage(params);
    var resultSet = machineModel.getResultSet(params, items);
    res.render('machine', {
      "playerNames" : playerNames,
      "years" : years,
      "title" : "Stat Machine",
      "id" : "machine",
      "slug" : "statbook",
      "subSlug" : "statbook/machine",
      "isSuccessfulQuery" : isSuccessfulQuery,
      "tableHeading" : tableHeading,
      "resultsMessage" : resultsMessage,
      "resultSet" : resultSet
    });
  });
});

/* GET standings overview page. */
router.get('/standings', function(req, res) {
  var db = req.db;
  db.collection('seasons').find().toArray(function (err, items) {
    var standingsRows = statbookModel.getStandingsRows(items);
    res.render('standings', {
      "seasons" : items,
      "standings" : standingsRows,
      "title" : "Standings Overview",
      "id" : "standings",
      "slug" : "statbook",
      "subSlug" : "statbook/standings"
    });
  });
});

module.exports = router;
