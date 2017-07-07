// dependencies
var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var session         = require('express-session');
var mongostore      = require('connect-mongo')(session); // store pour la rapidité / Partage avec les sockets

var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var app      = express();
var http     = require('http');
var server   = http.Server(app);
var io                  = require('socket.io').listen(server);
var passportSocketIo    = require("passport.socketio");

// SETTINGS =====================================================================
var mongo_db = process.env.mongo_db || 'mongodb://localhost/test1';
var session_secret = process.env.session_secret || 'a changer';
var session_key = "connect.sid";
var port = process.env.port || 8080;
var pkg = require('./package.json');

app.use(express.static(__dirname + '/public'));

// DB             ===============================================================


// Connect mongoose
mongoose.connect(mongo_db, function(err) {
    if (err) {
        console.log('Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!');
    }
});

var sessionStore = new mongostore({url: mongo_db});

// CONFIGURATIONS ===============================================================

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    store:              sessionStore,          // we NEED to use a sessionstore. no memorystore please
    secret:             session_secret,
    key:                session_key,
    resave:             false,
    saveUninitialized:  false
}));
app.use(flash());
// Configure passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./lib/config/passport')(passport); // pass passport for configuration


// DECLARATION DES SOCKETS =====================================================

// Users need to be logged in :
io.use(passportSocketIo.authorize({
    cookieParser:  cookieParser,
    secret:        session_secret,    // the session_secret to parse the cookie
    key:           session_key,
    store:         sessionStore,          // we NEED to use a sessionstore. no memorystore please
}));

// load consumer.js and pass it the socket.io object
require('./lib/socket_handlers/home.js')(io);
require('./lib/socket_handlers/games.js')(io);

// ROUTES ======================================================================

app.use('/', require('./rooter/index'));
app.use('/users/', require('./rooter/users'));
app.use('/games/', require('./rooter/games'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// ERROR HANDLER ===============================================================

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// LAUNCH ======================================================================

server.listen(port, function() {
    console.log(pkg.name, 'listening on port ', port);
});