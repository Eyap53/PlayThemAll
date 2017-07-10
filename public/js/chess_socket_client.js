var board;
var game;
var started = false;

window.onload = function () {
    initGame();
};

var initGame = function() {
   var cfg = {
       draggable: true,
       position: 'start',
       onDrop: handleMove,
   };
   
   board = new ChessBoard('gameBoard', cfg);
   game = new Chess();
};

		// Connexion à socket.io
    var chess_socket = io.connect('/games/chess');
	
	chess_socket.on('connect', function() {
		// Connected, let's sign-up for to receive messages for this room
		chess_socket.emit('join', "1");
	});

		// Quand on reçoit un message, on l'insère dans la page
    chess_socket.on('message', function(data) {
        insereMessage(data.username, data.message);
    });

		// Quand un nouveau client se connecte, on affiche l'information
    chess_socket.on('new_client', function(username) {
        $('#zone_chat').prepend('<p><em>' + username + ' a rejoint le salon !</em></p>');
    });
	
		// Quand un client se deconnecte, on affiche l'information
    chess_socket.on('client_disconnected', function(username) {
        $('#zone_chat').prepend('<p><em>' + username + ' a quitté le salon.</em></p>');
    });

		// Lorsqu'on envoie le formulaire, on transmet le message et on l'affiche sur la page
    $('#formulaire_chat').submit(function () {
        var message = $('#message').val();
        chess_socket.emit('message', message); // Transmet le message aux autres
        insereMessage('Moi', message); // Affiche le message aussi sur notre page
        $('#message').val('').focus(); // Vide la zone de chat et remet le focus dessus
        return false; // Permet de bloquer l'envoi "classique" du formulaire
    });

		// Ajoute un message dans la page
    function insereMessage(username, message) {
        $('#zone_chat').prepend('<p><strong>' + username + '</strong> : ' + message + '</p>');
    };
	

	
		// Called when the server calls socket.broadcast('move')
	chess_socket.on('move', function (data) {
		game.move(data);
		board.position(game.fen()); // fen is the board layout
	});


			// Concerne le lobby
	
		// Lobby plein
    chess_socket.on('ready', function() {
		$('#zone_chat').prepend('<p>Le salon est plein. La partie peut commencer.</p>');
		$('#zone_start_button').prepend('<input type="button" value="Lancer le jeu"/>');
    });
	
		//Pour le start
	$("#zone_start_button").click(function() { //C'est un peu moche mais ça a l'air de fonctionner
		chess_socket.emit('start_game');
	});
	
		//Si un joueur veut abandonner
	$("#game-surrender").click(function() { //
		chess_socket.emit('surrender');
	});
	
	
		// called when a player makes a move on the board UI
	var handleMove = function(source, target) {
		var move = game.move({from: source, to: target});
		
		if ( move === null || !started )  return 'snapback';
		else chess_socket.emit('move', move);
		
	};

		// called when the server calls socket.broadcast('move')
	chess_socket.on('start', function (list_player) {
		started = true;
		$('#zone_chat').prepend('<p>Le salon est plein. La partie peut commencer.</p>');
		var len = list.length;
		for ( var i = 0; i < len; i++) {
			$('#zone_chat').prepend('<p>' + list[i].name + 'est dans l equipe : ' + list[i].team + '</p>');
		};
	});
	
		// called when the server calls socket.broadcast('move')
	chess_socket.on('move', function (msg) {
		game.move(msg);
		board.position(game.fen()); // fen is the board layout
	});
	
			// forbidden
    chess_socket.on('forbidden', function(msg) {
		$('#zone_chat').prepend('<p><strong>' + msg + '</strong></p>');
    });


