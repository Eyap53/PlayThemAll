module.exports = function(io) {

    var ent = require('ent');
	
	var games = []; // Contain all the infos about the games. It's an Array
	
	var chess =  require('../../public/lib/chess.js');
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
				
				game = new game_object.Game(new chess.Chess(), room, me.NAME, 2);
				game.add_user(me);
				games.push(game);
				
				socket.emit('wait');
			} else {
				// we join it
				game.add_user(me);
				
				// Change this later
				console.log('pret a jouer');
				socket.to(room).emit('ready');
			}
		
			
			console.log( socket.request.user.username + ' connected to chess lobby');
			// We inform the other users
			socket.to(room).emit('new_client', socket.request.user.username); // Be aware of script and html !! i need to verify they are not executed

			
			socket.on('message', function (message) {
				// When we get a new messages, we broadcast the author's pseudo, and the message
				socket.broadcast.to(room).emit('message', {username: socket.request.user.username, message: ent.encode(message)});
			});

			
					
			
			socket.on('start_game', function() {
				var users = game.users();
				var teams = game.get_teams();
				var list = [];
				var len = users.length;
				for (var i = 0; i < len; i++) {
					var user = users[i];
					if (user.get_status() === "player" ) {
						user.set_team() = teams[i];
						list.push({name: user.NAME, team:  user.get_team()});
					};
				};
				game.start();		
				socket.to(room).emit('start');
				socket.emit('start', list);
			});
			
				// Called when the client calls socket.emit('move')
			socket.on('move', function(data) {
				console.log(game.info());
				console.log("move");
				if ( game.info() != 'ongoing') { // REMETTRE ONGOING
					console.log(me.NAME + " a voulu jouer sans que la partie soit demarrée");
					socket.emit('forbidden', 'not started yet');
				} else {
					console.log("Turn : " + game.process().turn());  // NEED TO USE THIS NOTATION
					
					
					
					
					console.log( me );
					console.log( me.team() );
					console.log( game.process().can_play( 'w' ) );
					console.log( game.process().can_play( 'b' ) );
					
					if ( game.process().can_play( me.team() ) ) {
						
						
						
						
						var move = game.process().move(data);
				
						
						if (move === null)  {
							socket.emit('forbidden', 'move forbidden');
						} else {
							console.log('moved')
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
				// TO DO
				
			});
			
			
			socket.on('disconnect', function () { // Problème avec le reload de page. A voir plus tards
				console.log(socket.request.user.username + ' disconnected');
				if (numClientsInRoom('/games/chess', room) == 0 ) {
					// Remove the game from the games list
					// then the game need to be destroyed
				} else {
					//socket.broadcast.to(room).emit('client_disconnected', socket.request.user.username);
					//game.users[1].socket() = null;
					//game.users[1].NAME = "";
					//game.users[1].info() = "open";

					game.info() = "waiting"; // A changer si on rajoute des spectateurs
					
				}
			});
		});
    });
	
	// The var namespace is not really usefull
	function numClientsInRoom(namespace, room) {
		var clientsInRoom = io.nsps[namespace].adapter.rooms[room];
		var numClients = clientsInRoom === undefined ? 0 : Object.keys(clientsInRoom.sockets).length;
		return numClients;
	};

	function getPlayer(game) {
		// Get the player object of a side

		var side = game.process().turn();
		var users = game.users()
		var len = users.length;
		console.log(users);
        for (var i = 0; i < len; i++) {
            var player = users[i];
			console.log(player);
            if (player.team() === side) {
				console.log(player);
                return player;
            }
        }
    };
	
	function find_game(a_room) {
		// Find the game object associated yith a room
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





