var express = require('express');
var router = express.Router();

/* GET games/ */
router.get('/', isLoggedIn, function(req, res, next) {
  res.send('respond with a resource');
});

/* GET games/ */
router.get('/chess/:id_room', isLoggedIn, function(req, res, next) {
  res.render('chess', { user : req.user, room : req.params.id_room });
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