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
			console.log( socket.request.user.username + ' connected to chess lobby');
			
			socket.player = new gamer_object.Gamer(socket.request.user.username);
			
			var game = find_game( room );
			if (game == null) {
				// we create it
				console.log('New game on room n.' + room);
				
				game = new game_object.Game(new chess.Chess(), room, socket.player.NAME, 2);
				game.add_user(socket.player);
				games.push( game );
			} else {
				// we join it
				game.add_user( socket.player );
							
				is_ready( game , socket, room );
				
			};
		
			
			
			// We inform the other users
			socket.to(room).emit('new_client', socket.request.user.username); // Be aware of script and html !! i need to verify they are not executed

			
			socket.on('message', function (message) {
				// When we get a new messages, we broadcast the author's pseudo, and the message
				socket.to(room).emit('message', {username: socket.request.user.username, message: ent.encode(message)});
			});

			
					
			
			socket.on('start_game', function() {			
				var game_started = game.start();
				
				if ( game_started ) {
					var teams = game.get_teams();
					
					socket.to(room).emit('start', teams);
					socket.emit('start', teams);
				};
			});
			
				// Called when the client calls socket.emit('move')
			socket.on('move', function(data) {
				
				move_result = game.move( socket.player, data );
				
				socket.emit( move_result[0], move_result[1] );
				if (move_result[0] != "forbidden") {
					socket.to(room).emit( move_result[0], move_result[1] );
					
					
					move_ai = game.ai_play();
					
					if ( move_ai != null ) {
						socket.to(room).emit( move_ai[0], move_ai[1] );
						socket.emit( move_ai[0], move_ai[1] );
					};
				};
			});
			
			
			
			socket.on('test', function() {
				
				console.log( game.process().moves() );
				
			});			
			
			socket.on('reset', function () {
				
				var reset = game.reset(); // Boolean, reset or not.
				
				socket.emit('reset', reset);
				socket.to(room).emit('reset', reset);
	
			});
			
			
			
			socket.on('surrender', function() {
				console.log("TODO : Surrender de " + socket.request.user.username)
				// TO DO
				
			});
			
			socket.on('play_against_AI', function() {
				console.log('smn wants to play against ai.');
				
				
				var ai_player = new gamer_object.Gamer("AI player", "ai");
			
				//Need to be sure it is possible. To do in the game object
				game.add_user(ai_player);
				
				is_ready( game , socket, room );
			});
			
			
			socket.on('disconnect', function () {
				console.log(socket.request.user.username + ' disconnected from chest lobby');
				console.log( game.get_status() );
				/* 2 options :
				*	- players were waiting for people
				* 	- during the game : he gives up
				*/
				
				game.remove_user(socket.player);
				
				console.log( game.get_status() );
				
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
		var users = game.get_users()
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
		for (var i = 0; i < len; i++) {
			console.log(games[i].ROOM);
			if (games[i].ROOM == a_room) {
				console.log("game found");
				return (games[i]);
			};
		};
		return null;
	};
	
	function is_ready(game, socket, room) {
		console.log( "Are the room ready ? Status : " + game.get_status() );
		
		if ( game.get_status() == "ready") {
			socket.to(room).emit('ready');
			socket.emit('ready');
		}
	};
	
};





