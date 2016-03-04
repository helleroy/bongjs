var express = require('express');
var router = express.Router();

var Firebase = require('firebase');
var firebaseRef = new Firebase('https://glowing-torch-1751.firebaseio.com/');

var STARTING_DRINKS = 3;

router.post('/drink', function (req, res) {
    var id = req.body.uuid;

    getUser(id)
        .then(function (user) {
            if (user === null) {
                return newUser(id)
            }
            return user;
        })
        .then(function (user) {
            return decrementDrinkFrom(user, id);
        })
        .catch(function (e) {
            res.send(e);
        })
        .then(function (user) {
            res.send(user)
        });
});

function decrementDrinkFrom(user, id) {
    var update = user;

    if (update.drinks > 0) {
        update.drinks--;
        update.hasDrunk++;
    } else {
        return Promise.reject('The user has no more drinks left.');
    }

    return firebaseRef.child(`user/${id}`).update(update)
        .then(function () {
            return update;
        });
}

function newUser(id) {
    var newUser = {drinks: STARTING_DRINKS, hasDrunk: 0};
    return firebaseRef.child(`user/${id}`).set(newUser)
        .then(function () {
            return newUser;
        });
}

function getUser(id) {
    return firebaseRef.child(`user/${id}`).once('value').then(function (data) {
        return data.val();
    });
}

module.exports = router;
