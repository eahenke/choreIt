var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');
var Group = mongoose.model('Group');
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


//view all groups
//request will have to have a user

//Get all groups by user
router.get('/groups', auth, function(req, res, next) {
    var username = req.payload.username;
    Group.find({username: username}).populate('chores').exec(function(err, groups) {
        if(err) {
            return next(err);
        }
        res.json(groups);
    });
});

//add a new group
router.post('/groups', auth, function(req, res, next) {
    var group = new Group(req.body);

    group.save(function(err, group) {
        if(err) {
            return next(err);
        }
        res.json(group);
    })
});

//group preloader
router.param('group', function(req, res, next, id) {
    var query = Group.findById(id);

    query.exec(function(err, group) {
        if(err) {
            return next(err);
        }
        if(!group) {
            return next(new Error('Can\'t find group'));
        }
        req.group = group;
        return next();
    })
});

//add a new chore
router.post('/groups/:group/chore', auth, function(req, res, next) {
    var chore = new Chore(req.body);
    chore.group = req.group;

    chore.save(function(err) {
        if(err) {
            return next(err);
        }
        req.group.chores.push(chore);
        req.group.save(function(err) {
            if(err) {
                return next(err);
            }
            res.json(chore);
        });
    });
});


//register
router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password);

  user.save(function (err){
    if(err){ return next(err); }

    var token = user.generateJWT();
    // console.log(token);
    return res.json({token: token});
  });
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