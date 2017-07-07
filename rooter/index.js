var passport = require('passport');
var router = require('express').Router();
var flash = require('connect-flash');

router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

router.get('/signup', function(req, res) {
    res.render('signup', {message: req.flash('error')});
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true }));


router.get('/login', function(req, res) {

    res.render('login',  {message: req.flash('error')} );
});

router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true }));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/home', isLoggedIn, function (req, res) {
    res.render('home', { user : req.user });
});

module.exports = router;

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}