var express = require('express');
var router = express.Router();

/* GET statbook page. */
router.get('/', function(req, res) {
  var db = req.db;
  db.collection('seasons').find().toArray(function (err, items) {
    res.render('data', {
      "title" : "Data Entry",
      "id" : "data",
      "slug" : "data",
      "password" : "camping73"
    });
  });
});

module.exports = router;
