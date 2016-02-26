var express = require('express');
var router = express.Router();

var STARTING_DRINKS = 3;

var db = {};

router.get('/', function (req, res, next) {
    res.send('This is not the endpoint you are looking for.');
});

router.post('/drink', function (req, res) {
    var id = getUUID(req);

    if (isRegistered(id)) {

        if (getDrinksLeft(id) === 0) {
            res.send('You are out of drinks, friendo.');
            return;
        }

        drink(id);

        if (getDrinksLeft(id) === 0) {
            res.send('This is your last drink. (You can refill *wink wink*)');
            return;
        }

        res.send(logDrinksLeft(id));
    } else {
        fillUp(id);
        drink(id);
        res.send(ologDrinksLeft(id));
    }
});

router.post('/refill', function (req, res) {

    var id = getUUID(req);

    fillUp(id);

    res.send(logDrinksLeft(id));
});

function getDrinksLeft(id) {
    return db[id];
}

function getUUID(req) {
    return req.body.uuid;
}

function fillUp(id) {
    if (isRegistered(id)) {
        db[id] += STARTING_DRINKS;
    } else {
        db[id] = STARTING_DRINKS;
    }
}

function isRegistered(id) {
    return db[id] !== undefined;
}

function drink(id) {
    if (db[id] > 0) {
        db[id]--;
    }
    return db[id];
}

function logDrinksLeft(id) {
    return 'Enjoy your drink! You have ' + db[id] + ' drink(s) left.';
}

module.exports = router;
