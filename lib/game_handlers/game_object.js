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
    var users = [];					// Contain all of the users : Players, Spectators, and Ais.
	var number_of_spectator = 0;	// Record the number of spectator in the game;
	var number_of_player = 0;		// Record the number of player in the game (excluding spectator and ai);
	var number_of_ai = 0;			// Record the number of ai in the game ;
	var max_number_of_player;
	
	if (typeof max_number_of_player === 'undefined') {
		max_number_of_player = 2;
	} else {
		max_number_of_player = a_max_number_of_player;
	}
		
		
	function add_user(user){
		// TODO : be sure the user isn't already in the game
		
		users.push(user);
		
		// count the number of player
		if ( user.get_status() == "player" ) {
			number_of_players++; 
			if (number_of_players == max_number_of_player) {
				console.log('Max de joueur atteint');
				status = "ready"; 
			}
			else if (number_of_players > max_number_of_player ){ // It should be not possible to join as a player a game full.
				status = "error"; 
			}
			else if (number_of_players > 0 ){
				status = "waiting"; 
			}
		}
		else if ( user.get_status() == "spectator" ) {
			number_of_spectator++;
		}
		else if ( user.get_status() == "ai" ) {
			number_of_ai++;
		}
	}
	
	function remove_user(user){
		
		/* 2 options :
		*	- players were waiting for people
		* 	- during the game : he gives up
		*/
		
		var index_user = get_user_id(user.NAME);
		users.splice(index_user, 1);
		
		if (user.get_status() == "player") {
			number_of_players--;
			
			if (status == "ready") {
				status = "waiting";
			}
			else if ( number_of_players == 0 ) {
				status = "empty";
			}
		}
		else if ( user.get_status() == "spectator" ) {
			number_of_spectator--;
		}
		else if ( user.get_status() == "ai" ) {
			number_of_ai--;
		}		
	}
	
	function update_info(new_status) {
		status = new_status;
	}
	
	function change_leader(requester_name, new_leader_name) {
		if (leader == requester_name) {
			leader = new_leader_name;
		}
	}	
		
		
	function get_user_id(username) {
		/// Return the user id by his name
		var i = 0;
		
		while ( i < number_of_users ) {
			if (users[i].name = username) return i;
			
			i++;
		}
		// Gerer le retour d erreur possible
		// return error....('could not find the user');
	}
	
	// NOT USED YET
	function get_user_object(username) {
		/// Return the user object by his name
		// it is quite a duplication of the get_user_id function
		var i = 0;
		
		while (i < number_of_users && !found) {
			if (users[i].name = username) return users[i];
			
			i++;
		}
		// Gerer le retour d erreur possible
		// return error....('could not find the user');
	}	
		
	function count_players() {
		var count = 0;
		users.forEach(function(user) {
			if (user.status == "player") {
			count+1;
			}
		});
		return count
	}
	
	function start() {
	  console.log("la fonction start est appelée")
	  update_info('ongoing');
	  startedDate = Date.now();
    }	
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
	};
};

/* export Chess object if using node or any other CommonJS compatible
 * environment */
if (typeof exports !== 'undefined') exports.Game = Game;
