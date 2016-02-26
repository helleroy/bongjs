var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send('This is not the endpoint you are looking for.');
});

router.post('/drink', function (req, res) {
    res.send('Get yo drink on brah');
});

router.post('/refill', function (req, res) {
    res.send('REUP!');
});

module.exports = router;
