var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use('login', new LocalStrategy(
    function(username, password, done) {
        User.findOne({username: username}, function(err, user) {
            if(err) {
                return done(err);
            }
            if(!user || !user.validPassword(password)) {
                return done(null, false, {message: 'That username/password combination do not match'});
            }
            return done(null, user);
        });
    }    
));

passport.use('register', new LocalStrategy(function(username, password, done) {
    User.findOne({username: username}, function(err, user) {
        if(err) {
            return err;
        }
        if(user) {
            console.log('username taken');
            return done(null, false, {message: 'That username is already taken.'});
        } else {
            //register new User
            var newUser = new User();
            newUser.username = req.body.username;
            newUser.setPassword(req.body.password);

            //save
            newUser.save(function(err) {
                if(err) {
                    return next(err);
                }
                return done(null, newUser);
            });
        }
    })
}))