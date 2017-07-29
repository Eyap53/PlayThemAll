// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../../models/user');


module.exports = function(passport) {

passport.use('local-login', new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username : username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, {message: 'Pas d\'utilisateur avec ce login.'});
            }
            console.log(err);
            user.authenticate(password, function(err, result_user, result_message){
                if (err) {
                    console.log(err);
                    return done(null, false, {message: err});
                }
                console.log(result_message);
                return done(null, result_user, result_message); // PROBLEME, CONNECTE A TOUT LES COUPS !!!
            });

        });
    }
));

passport.use('local-signup', new LocalStrategy(
    function(username, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            User.findOne({ username :  username }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, {message: 'username déjà pris'});
                } else {
                    // if there is no user with that email
                    // create the user
                    var newUser = new User();
                    newUser.username = username;
                    newUser.setPassword(password, function(err) {
                        if (err) {
                            return done(err);
                        }

                        newUser.save(function(saveErr) {
                            if (saveErr) {
                                return done(saveErr);
                            }});
                        return done(null, newUser);

                    });
                };
            });
        });
    }
    )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

};