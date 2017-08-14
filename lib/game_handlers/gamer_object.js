var Gamer = function(a_name, a_status) {
	/// Socket and name required
	
    var NAME = a_name;
	
	var LIST_STATUS_AVAILABLE = ["player","spectator","ai"];
    var status;
	
	
	
	var team = "";
		
		// Constructor 
		
	if (typeof a_status === 'undefined') {
		status = "player";
	} else {
		status = a_status;
	};
	
	function set_team(new_team){
		team = new_team;
	};
	
	function set_status( new_status ){
		if ( LIST_STATUS_AVAILABLE.includes( new_status ) ) {
			status = new_status;
			
			return;
		}
		else {
			return new Error();
		};
		
	};
		
		
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
	set_status: function(new_status) {
	  return set_status(new_status);
    },
	get_team: function() {
	  return team;
    },
	set_team: function(a_team) {
	  return set_team(a_team);
    },
	
	};
	
};

/* export Chess object if using node or any other CommonJS compatible
 * environment */
if (typeof exports !== 'undefined') exports.Gamer = Gamer;
