module.exports = function(io) {
    var ent = require('ent');

    var game = io.of('/tictactoe');
    game.on('connection', function (socket) {
        console.log((socket.request.user.username) + ' connected to the tic tac toe game');
        var game_started = false;

        // On averti les autres users de la connexion
        socket.broadcast.emit('nouveau_client', socket.request.user.username); //Attention aux injection de script et html !! ils passent actuellement

        // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
        socket.on('message', function (message) {
            socket.broadcast.emit('message', {username: socket.request.user.username, message: ent.encode(message)});
        });

        socket.on('disconnect', function () {
            console.log(socket.request.user.username + ' disconnected');
        });

        ////// PARTIE JEU /////////////////////////////////////////////////////////////////

        var Table = require('./_table.js');


        socket.on('start', function(){
            game_started = true;
        });

        socket.on('marker', function(){
            board[i][j]

        });


        socket.on("make a move", function (data, fn) {
            console.log('Player (id: ' + socket.id + ') make a move at [' + data.x + ';' + data.y + ']');
            var table = socket.table;
            var result = table.makeAMove(data.x, data.y);
            fn({ok: result.status >= 0});
            if (result.status >= 0) {
                io.to(socket.currentTable).emit('make a move', {
                    x: data.x,
                    y: data.y,
                    value: table.getCurrentTurn(),
                    nextTurn: table.nextTurn(),
                    isWinningMove: {
                        status: result.status == 1,
                        data: result.data
                    }
                });

                if (result.status == 1) {
                    var playerX = table.getPlayerX();
                    var playerO = table.getPlayerO();

                    playerX.leave(socket.currentTable);
                    playerO.leave(socket.currentTable);
                    table = null;
                    playerX.currentTable = null;
                    playerO.currentTable = null;
                    playerX.table = null;
                    playerO.table = null;
                }

            }
        });

    };