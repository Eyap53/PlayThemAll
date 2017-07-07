module.exports = function(io) {

    var ent = require('ent');
	
	var games = []; // Contain all the infos about the games
	
	var chess =  require('../../public/lib/chess.min.js');
	var gamer_object =  require('../game_handlers/gamer_object.js');
	var game_object =  require('../game_handlers/game_object.js');

    var chess_socket = io.of('/games/chess');
    chess_socket.on('connection', function (socket) {
		socket.on('join', function(room) {
			
			socket.join(room);
			
			
			me = new gamer_object.Gamer(socket, socket.request.user.username);
			
			
			var game = find_game(room);
			if (game == null) {
				// we create it
				console.log('premier joueur');
				
				game = new game_object.Game(new chess.Chess(), room, me.name, 2);
				game.add_user(me)
				games.push(game);
				
				socket.emit('wait');
			} else {
				// we join it
				game.add_user(me);
				
				// Change this later
				console.log('pret a jouer');
				socket.to(room).emit('ready');
			}
		
			//// Partie  ////
			
			console.log( socket.request.user.username + ' connected to chess lobby');
			// On averti les autres users de la connexion
			socket.to(room).emit('new_client', socket.request.user.username); //Attention aux injection de script et html !! ils passent actuellement

			
			// Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
			socket.on('message', function (message) {
				socket.broadcast.to(room).emit('message', {username: socket.request.user.username, message: ent.encode(message)});
			});

			
					
			
						
				//// Partie  ////	
			socket.on('start_game', function() {
				game.start();		
				socket.to(room).emit('start');
				socket.emit('start');
			});
			
				// Called when the client calls socket.emit('move')
			socket.on('move', function(data) {
				console.log(game.info());
				console.log("move");
				if ( game.info() != 'ongoing') { // Va pas
					socket.emit('forbidden', 'not started yet');
				} else {
						// If it's the right turn
					console.log("Un move : " + game.process.turn() ); //is not a function, careful
					
					//// A MODIFIER A PARTIR DE LA ////
					
					if ( getPlayer(room, game.process.turn()).name == socket.request.user.username ) {
						console.log(data)
						var move = game.process.move(data);
				
						console.log('move')
						if (move === null)  {
							socket.emit('forbidden', 'move forbidden');
						} else {
							console.log('do it')
							socket.to(room).emit('move', data);
							
							// TODO
							// Gerer lq fin de partie (suivant les trucs possibles)
							// if ( game.game_over ) socket.to(room).emit('move', data);
						};
					} else {
						socket.emit('forbidden', 'not your turn');
					};
				};
			});
			
			
			
			
			
			
			
			
			socket.on('surrender', function() {
				console.log("Surrender de " + socket.request.user.username)
				// Actions
				
			});
			
			
			socket.on('disconnect', function () { // Problème avec le reload de page. A voir plus tards
				console.log(socket.request.user.username + ' disconnected');
				if (numClientsInRoom('/games/chess', room) == 0 ) {
					// A voir
				} else {
					socket.broadcast.to(room).emit('client_disconnected', socket.request.user.username);
					game.users[1].socket = null;
					game.users[1].name = "";
					game.users[1].info = "open";

					game.info = "waiting"; // A changer si on rajoute des spectateurs
					
				}
			});
		});
    });
	
	//Peut être pas utile ede garder la var namespace
	function numClientsInRoom(namespace, room) {
		var clientsInRoom = io.nsps[namespace].adapter.rooms[room];
		var numClients = clientsInRoom === undefined ? 0 : Object.keys(clientsInRoom.sockets).length;
		return numClients;
	};

	function getPlayer(room, side) {
        var game = games[room];
        for (var i in game.users) {
            var player = game.users[i];
            if (player.team === side) {
                return player;
            }
        }
    };
	
	function find_game(a_room) {
		var len = games.length;
		console.log(games);
		console.log(len);
		for (var i = 0; i < len; i++) {
			console.log(games[i].ROOM);
			if (games[i].ROOM == a_room) {
				console.log("game found");
				return (games[i]);
			};
		};
		return null;
	};
	
};





