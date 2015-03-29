var express = require('express');
var router = express.Router();
var helper = require('../helpers');

/* GET home page. */
router.get('/', function(req, res) {
  var db = req.db;
  db.collection('news').find().sort({post_date: -1}).toArray(function (err, items) {
    for (var i=0; i<items.length; i++) {
      items[i].post_date = helper.formatDateTime(items[i].post_date);
    }
    res.render('index', {
      "news" : items,
      "title" : "News",
      "id" : "news",
      "slug" : "news"
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
      "id" : "players",
      "slug" : "players"
    });
  });
});

/* GET hall of fame page */
router.get('/hof', function(req, res) {
  res.render('hof', {
    "title" : "Hall of Fame",
    "id" : "hof",
    "slug" : "hof"
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
      "id" : "history",
      "slug" : "history",
      "toTop" : true
    });
  });
});

/* GET sidebets page */
router.get('/sidebets', function(req, res) {
  res.render('sidebets', {
    "title" : "Side Bets",
    "id" : "sidebets",
    "slug" : "sidebets"
  });
});

/* GET rules page */
router.get('/rules', function(req, res) {
  res.render('rules', {
    "title" : "Rules",
    "id" : "rules",
    "slug" : "rules"
  });
});

module.exports = router;
