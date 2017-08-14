var Game = function(the_process, the_room, the_creator, a_max_number_of_player ) {
	
	/// We really need to make the separation between the data about the game, and the game itself.
	/// For example, a leader will be defined here, because it's not essential to the game
	/// However, the different turn won't be defined here, because it concerned the game itself
	/// (For exemple, there are games without turns.)
	
	// Constants are in uppercase
	
	var CREATOR = the_creator;
	
	var leader;
	var status = "empty"; // Can be : empty, waiting, ready, ongoing or even error (but hopefully not)
	
	var ROOM = the_room;
	var process = the_process;

    var creationDate = Date.now();
	var startedDate;
	var started = false;
    var users = [];					// Contain all of the users : Players, Spectators, and Ais.
	
	var number_of_spectator = 0;	// Record the number of spectator in the game;
	var number_of_player = 0;		// Record the number of player in the game (excluding spectator and ai);
	var number_of_ai = 0;			// Record the number of ai in the game ;
	var max_number_of_player;
	
	var teams = ["w","b"];			// For now just white and black
	
	if (typeof max_number_of_player === 'undefined') {
		max_number_of_player = 2;
	} else {
		max_number_of_player = a_max_number_of_player;
	}
		
	
	
	
	
	
	function set_teams() {
		var j = 0;
		for (i = 0; i < users.length; i++){
			if ( users[i].get_status() != "spectator" ) {
				users[i].set_team( teams[ j ] ); // First will be "w", second "b"
				j++;
			};
		};	
	};
	
	function get_teams() {
		/// Return the tems of each player
		/// Format : [ ['a_user','a_team'] , ['another_user','another_team'] , ... ]
		
		var j = 0;
		var players = [];
		var one_player;
		for (i = 0; i < users.length; i++){
			if ( users[i].get_status() != "spectator" ) {
				
				one_player = [];
				one_player.push( users[i].NAME );
				one_player.push( users[i].get_team() );
				
				players.push( one_player ); // First will be "w", second "b"
				j++;
			};
		};	
		
		return players;
	};
			
			
			
			
	function add_user( user ) {
		// TODO : be sure the user isn't already in the game
		
		users.push(user);
		
		console.log( "Number of player " + String(number_of_player) );
		
		switch( user.get_status() ) {
			case "player":
				number_of_player++;
				console.log( "Number of player " + String(number_of_player) );
				break;
			case "spectator":
				number_of_spectator++;
				break;
			case "ai":
				number_of_ai++;
				break;
		}
		
		update_status();
		return;
	};
	
	function remove_user( user ) {
		
		/* 2 options :
		*	- players were waiting for people
		* 	- during the game : he gives up
		*/
		

		users.splice( get_user_id(user.NAME), 1);
		
		switch( user.get_status() ) {
			case "player":
				number_of_player--;	
				break;
			case "spectator":
				number_of_spectator--;
				break;
			case "ai":
				number_of_ai--;
				break;
		};

		update_status();
		return;
	};
	
	function update_status() {
		
		console.log( "In room n." + ROOM + ", there are " + String(number_of_player) + " player(s)");
		
		if ( number_of_player + number_of_ai == max_number_of_player ) {
			console.log( "The lobby in room n." + ROOM + " is full" );
			status = "ready"; 
		}
		else if ( number_of_player + number_of_ai > max_number_of_player ){ // It should be not possible to join as a player a game full.
			status = "error"; 
		}
		else if ( number_of_player == 0 ){ // Called when players leave the lobby, or at the end of a game
			status = "empty"; 
			// TODO ? Need to destroy the game
		}
		else if ( !started ){
			status = "waiting";
		}
	};
	
	function change_leader( requester_name, new_leader_name ) {
		if ( leader == requester_name ) {
			leader = new_leader_name;
		}
	};	
		
		
	function get_user_id(username) {
		/// Return the user id by his name
		var i = 0;
		var number_of_user = number_of_player + number_of_spectator + number_of_ai;
		
		while ( i < number_of_user ) {
			if (users[i].name == username) return i;
			
			i++;
		}
		// Gerer le retour d erreur possible
		// return error....('could not find the user');
	};
	
	// NOT USED YET
	function get_user_object(username) {
		/// Return the user object by his name
		
		// it is quite a duplication of the get_user_id function
		var i = 0;
		
		var number_of_user = number_of_player + number_of_spectator + number_of_ai;
		
		while (i < number_of_user && !found) {
			if (users[i].name = username) return users[i];
			
			i++;
		}
		// Gerer le retour d erreur possible
		// return error....('could not find the user');
	};	
	
	function start() {
		// TO DO : Verification should be made here
		
		if ( status == "ready" ) {
			startedDate = Date.now();
			started = true;
			status = "ongoing";
			set_teams();
			console.log( "The game in room n." + ROOM + " has started" );
		};
		
		return started;
    };
	
	function move( player, data ) {

		console.log( "Player " + player.NAME	+ " want to make a move on room n." + ROOM + "." );
		
		if ( status != 'ongoing' ) {
			
			return ["forbidden", 'The game has not started yet'];
			
		} 
		else {
			console.log( "Turn : " + process.turn() );  // NEED TO USE THIS NOTATION
			
			if (  process.can_play( player.get_team() )  ) {
				
				var move = process.move( data );
		
				
				if (move === null)  {
					return["forbidden", 'That move is forbidden.'];
				} 
				else {
					// console.log("Correct move. Player " + player.NAME + " has played.");
					
					// socket.to(room).emit('move', process.fen());
					return ["move", process.fen()];
					

					/* 					
					is_finished();
					
					if( finished ) {
						// function is_finished
					}
					else {
						ai_play();
					}; 
					*/
										
				};
			} else {
				return ["forbidden", "It is not your turn"];
			}
		};
    };
	
	function is_finished() {
		/// Check if the game is finished.
		
		// TO DO
		
		var finished = process.game_over();
		
		if( finished ) {
			if( game.process().in_draw() ) {
				console.log('it is a draw');
				//socket.to(room).emit('game_ended', 'The game has ended : it s a draw');
				//socket.emit('game_ended', 'The game has ended : it s a draw');
			}
			else {
				console.log('someone won');
				//socket.to(room).emit('game_ended', 'The game has ended : someone won');
				//socket.emit('game_ended', 'The game has ended : someone won');
			}
		};
		
		return [finished, data];
	};
	
	function ai_play() {
		
		var chess_ai =  require('../../public/lib/chess_ai/chess_ai.js');
		
		console.log( get_current_player() );
		
		if ( get_current_player() == "AI player" ) {
			
			var depth = 3;							
			var bestMove = chess_ai.minimaxRoot(depth, process, true);
			
			process.ugly_move(bestMove);
			console.log("The AI has played in room n." + ROOM);
			
			// socket.emit('move', game.process().fen());
		
			return ["move", process.fen() ];
		} else {
			return;
		};
    };
	
	function reset() {
		// TO DO : some verifications should be made here 
		
		// Only leader should ba able to reset
		
		console.log( "A player want to reset the room n." + ROOM );
		
		process.reset();
		
		return true
    };
	
	function get_current_player() {
		var turn = process.turn();
		
		for (i = 0; i < users.length; i++) {
			
			if ( users[i].get_team() == turn ) {
				return users[i].NAME;
			};
		};
		
		return new Error();
    };
	
	
	
	
	return {
	
	/***************************************************************************
     * PUBLIC CONSTANTS (is there a better way to do this?)
     **************************************************************************/
    ROOM: ROOM,
		
		
	/***************************************************************************
    * PUBLIC API
    **************************************************************************/
	
	/// Some Variables :
	
	get_status: function() {
	  return status;
    },
	get_users: function() {
	  return users;
    },
	process: function() {
	  return process;
    },
	
	/// Some Functions :
	
	start: function() {
	  return start();
    },
	add_user: function(user) {
      return add_user(user);
    },
	remove_user: function(user) {
      return remove_user(user);
    },
	change_leader: function(requester_name, new_leader_name) {
      return change_leader(requester_name, new_leader_name);
    },
	move: function(player, data) {
	  return move(player, data);
    },
	ai_play: function() {
	  return ai_play();
    },
	reset: function() {
	  return reset();
    },
	get_current_player: function() {
	  return get_current_player();
    },
	get_teams: function() {
	  return get_teams();
    },
	
	};
};

/* export Chess object if using node or any other CommonJS compatible
 * environment */
if (typeof exports !== 'undefined') exports.Game = Game;
