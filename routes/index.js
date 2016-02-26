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
        var drinksLeft = drink(id);

        if (drinksLeft < 0) {
            res.send('You are out of drinks, friendo.');
            return;
        }

        if (drinksLeft === 0) {
            res.send('This is your last drink. (You can refill *wink wink*)');
            return;
        }

        res.send('You have ' + db[id] + ' drinks left. Enjoy!');
    } else {
        db[id] = STARTING_DRINKS;
        drink(id);
        res.send('You have ' + db[id] + ' drinks left. Enjoy!');
    }
});

router.post('/refill', function (req, res) {
    res.send('REUP!');
});

function getUUID(req) {
    return req.body.uuid;
}

function fillUp(id) {
    db[id] = STARTING_DRINKS;
}

function isRegistered(id) {
    return db[id] !== undefined;
}

function drink(id) {
    db[id]--;
    return db[id];
}

module.exports = router;
