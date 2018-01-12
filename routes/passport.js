var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const xss = require('xss');
const data = require('../data');
const User = data.users;


module.exports = function(passport) {
    // passport session setup, required for persistent login sessions
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    //Attention: you can also use the same method body as serializeUser. remove user by id is not nesssary.
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    passport.use('local', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
        function(req, username, password, done) {

            User.getUserByUsername(username.toLowerCase()).then((user) => {
                bcrypt.compare(password, xss(user.password), function (err, res) {
                    if (err)
                        return Promise.reject("Error");
                    else {
                        if (res === true)
                            return done(null, user);
                        else
                            return done(null, false, req.flash('loginMessage', 'Incorrect Password'));
                    }
                });
            }).catch((error) => {
                console.log(error);
                return done(null, false, req.flash('loginMessage', 'Incorrect Username'));
            });
        }
    ));
}
