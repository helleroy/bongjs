var express = require('express');
var app = express();
var path = require('path');
var server = require('http').Server(app);
var io = require('socket.io')(server);

var drinkRepo = require('./repository/drink-repository');

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function (socket) {

    console.log('Socket connected.');

    socket.on('drink', function (data, fn) {
        drinkRepo
            .drink(data.id)
            .catch(function (e) {
                fn(e);
            })
            .then(function (user) {
                fn(user);
            });
    });

    socket.on('refill', function (data, fn) {
        drinkRepo
            .refill(data.id)
            .then(function (user) {
                fn(user);
            });
    });
});

server.listen(3000);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}
