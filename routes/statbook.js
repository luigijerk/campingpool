var express = require('express');
var router = express.Router();
var model = require('../models/statbook');
var helper = require('../helpers');

/* GET statbook page. */
router.get('/', function(req, res) {
  var db = req.db;
  db.collection('seasons').find().toArray(function (err, items) {
    var players = model.getPlayers(items);
    res.render('statbook', {
      "seasons" : items,
      "players" : players,
      "title" : "Statbook",
      "id" : "statbook",
      "url" : "statbook"
    });
  });
});

/* GET standings overview page. */
router.get('/standings', function(req, res) {
  var db = req.db;
  db.collection('seasons').find().toArray(function (err, items) {
    var standingsRows = model.getStandingsRows(items);
    res.render('standings', {
      "seasons" : items,
      "standings" : standingsRows,
      "title" : "Standings Overview",
      "id" : "standings",
      "url" : "statbook/standings"
    });
  });
});

module.exports = router;
