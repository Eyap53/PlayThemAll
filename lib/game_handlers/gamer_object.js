var Gamer = function(a_socket, a_name,  a_team, a_status) {
	/// Socket and name required
	
	var socket = a_socket;
    var NAME = a_name;
    var status;
	var team = 'w';
		
		// Constructor 
		
	if (typeof a_status === 'undefined') {
		status = "player";
	} else {
		status = a_status;
	};
		
		
	return {
	
	/***************************************************************************
     * PUBLIC CONSTANTS (is there a better way to do this?)
     **************************************************************************/
    NAME: NAME,	
		
	/***************************************************************************
    * PUBLIC API
    **************************************************************************/
	
	/// Some Variables :
	
	team: function() {
	  return team;
    },
	
	};
	
};

/* export Chess object if using node or any other CommonJS compatible
 * environment */
if (typeof exports !== 'undefined') exports.Gamer = Gamer;
