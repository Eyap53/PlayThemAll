var Gamer = function(a_socket, a_name, a_status) {
	/// Socket and name required
	
	var socket = a_socket;
    var name = a_name;
    var status;
		
		// Constructor 
		
	if (typeof a_status === 'undefined') {
		status = "player";
	} else {
		status = a_status;
	};
		
		
		
		
	/***************************************************************************
    * PUBLIC API
    **************************************************************************/
	
	
	
	
};

/* export Chess object if using node or any other CommonJS compatible
 * environment */
if (typeof exports !== 'undefined') exports.Gamer = Gamer;
