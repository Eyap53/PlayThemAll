var Game = function(the_process, the_room, the_creator, max_number_of_player ) {
	
	/// We really need to make the separation between the data about the game, and the game itself.
	/// For example, a leader will be defined here, because it's not essential to the game
	/// However, the different turn won't be defined here, because it concerned the game itself
	/// (For exemple, there are games without turns.)
	
	// Constants are in uppercase
	
	var CREATOR = the_creator;
	
	var leader;
	var info = 'waiting';
	
	var ROOM = the_room;
	var process = the_process;

    var creationDate= Date.now();
	var startedDate;
    var users = [];
	var number_of_users;
	var number_of_players;
	
	if (typeof initial_number_of_player === 'undefined') {
    number_of_player = 2;
	} else {
		number_of_player = initial_number_of_player;
	}
		
		
	function add_user(user){
		// be sure the user isn't already in the game
		users.push(user);
		number_of_users++;
		// count the number of player
		if (user.info == "player") {
			number_of_players++; 
			if (number_of_players == max_number_of_player) {
				info = "ready"; 
			}
		}
	}
	
	function remove_user(name_user){
		// ou mettre le delay ?
		var index_user = get_user_id(username);
		users.splice(index_user, 1);
		
		var user = get_user_object(username);
		if (user.info == "player") {
			number_of_players--;
			
			if (number_of_players != max_number_of_player) {
				info = "waiting"; 
			}
		} 
	}
	
	function update_info(new_info) {
		info = new_info;
	}
	
	function change_leader(requester_name, new_leader_name) {
		if (leader == requester_name) {
			leader = new_leader_name;
		}
	}	
		
		
	function get_user_id(username) {
		/// Return the user id by his name
		var i = 0;
		
		while (i < number_of_users && !found) {
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
			if (user.info == "player") {
			count+1;
			}
		});
		return count
	}
	
	function start() {
	  console.log("la fonction start est appelée")
	  update_info('ongoing');
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
	
	info: function() {
	  return info;
    },
	users: function() {
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
	change_leader: function(requester_name, new_leader_name) {
      return change_leader(requester_name, new_leader_name);
    },
	};
};

/* export Chess object if using node or any other CommonJS compatible
 * environment */
if (typeof exports !== 'undefined') exports.Game = Game;
