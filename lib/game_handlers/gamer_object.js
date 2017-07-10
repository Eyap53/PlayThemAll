var Gamer = function(a_socket, a_name, a_status) {
	/// Socket and name required
	
	var socket = a_socket;
    var NAME = a_name;
    var status;
	var team;
		
		// Constructor 
		
	if (typeof a_status === 'undefined') {
		status = "player";
	} else {
		status = a_status;
	};
	
	function set_team(new_team){
		team = new_team;
	}
		
		
	return {
	
	/***************************************************************************
     * PUBLIC CONSTANTS (is there a better way to do this?)
     **************************************************************************/
    NAME: NAME,	
		
	/***************************************************************************
    * PUBLIC API
    **************************************************************************/

	get_status: function() {
	  return status;
    },
	get_team: function() {
	  return team;
    },
	set_team: function(a_team) {
	  team = a_team;
    },
	
	};
	
};

/* export Chess object if using node or any other CommonJS compatible
 * environment */
if (typeof exports !== 'undefined') exports.Gamer = Gamer;
