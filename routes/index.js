var express = require('express');
var helper = require('../helpers');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var db = req.db;
  db.collection('news').find().sort({post_date: -1}).toArray(function (err, items) {
    for (var i=0; i<items.length; i++) {
      items[i].post_date = helper.formatDateTime(items[i].post_date);
    }
    res.render('index', {
      "news" : items,
      "title" : "Camping Pool",
      "url" : "news"
    });
  });
});

/* GET players page. */
router.get('/players', function(req, res) {
  var db = req.db;
  db.collection('players').find().sort({order: 1}).toArray(function (err, items) {
    res.render('players', {
      "players" : items,
      "title" : "Player Bios",
      "url" : "players"
    });
  });
});

/* GET history page. */
router.get('/history', function(req, res) {
  var db = req.db;
  db.collection('history').find().toArray(function (err, items) {
    for (var i=0; i<items.length; i++) {
      items[i].showTitle = !helper.hasNumbers(items[i].anchor);
    }
    res.render('history', {
      "history" : items,
      "title" : "League History",
      "url" : "history"
    });
  });
});

module.exports = router;
