var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Week = mongoose.model('Week');
var Chore = mongoose.model('Chore');

var passport = require('passport');
var jwt = require('express-jwt');

//for authenticating users.  secret should be same as declared in User model
//userProperty puts a 'payload' property on request object
//change SECRET
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;


//view all weeks
//request will have to have a user

/*
router.get('/weeks', auth, function(req, res, next) {
    var username = req.payload.username;
    Week.find({username: username})
});
*/

//register
router.post('/register', function(req, res, next) {
    if(!req.body.username || !req.body.password) {
        res.status(400).json({message: 'Please fill out all fields'});
    }

    passport.authenticate('register', function(err, user, info) {
        if(err) {
            return next(err);
        }
        if(user) {
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

//login
router.post('/login', function(req, res, next) {
    if(!req.body.username || !req.body.password) {
        res.status(400).json({message: 'Please fill out all fields'});
    }

    passport.authenticate('login', function(err, user, info) {
        if(err) {
            return next(err);
        }
        if(user) {
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});