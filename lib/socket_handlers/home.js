module.exports = function(io) {
    var ent = require('ent');

    var chat = io.of('/home');
    chat.on('connection', function (socket) {
        console.log((socket.request.user.username) + ' connected to global chat');

        // On averti les autres users de la connexion
        socket.broadcast.emit('new_client', socket.request.user.username); //Attention aux injection de script et html !! ils passent actuellement

        // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
        socket.on('message', function (message) {
            socket.broadcast.emit('message', {username: socket.request.user.username, message: ent.encode(message)});
        });

        socket.on('disconnect', function () {
            console.log(socket.request.user.username + ' disconnected');
			socket.broadcast.emit('client_disconnected', socket.request.user.username);
        });

    });
};
