var Firebase = require('firebase');
var firebaseRef = new Firebase('https://glowing-torch-1751.firebaseio.com/');

var STARTING_DRINKS = 3;

function drink(id) {
    return getUser(id)
        .then(function (user) {
            if (user === null) {
                return newUser(id)
            }
            return user;
        })
        .then(function (user) {
            var update = user;

            if (update.drinks > 0) {
                update.drinks--;
                update.hasDrunk++;
            } else {
                return Promise.reject('The user has no more drinks left.');
            }

            return updateUser(update, id);
        })
        .then(function (user) {
            return user;
        });
}

function refill(id) {
    return getUser(id)
        .then(function (user) {
            if (user === null) {
                return newUser(id);
            }
            return user;
        })
        .then(function (user) {
            var update = user;
            update.drinks += 3;

            return updateUser(update, id);
        })
        .then(function (user) {
            return user;
        });
}

function updateUser(user, id) {
    return firebaseRef.child(`user/${id}`).update(user)
        .then(function () {
            return user;
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

module.exports = {drink: drink, refill: refill};
