/**
 * Created by Frederick on 23/03/2016.
 */
var User = require('mongoose').model('User'),
    passport = require('passport');

exports.create = function(req, res, next){
    var user = new User(req.body);
    user.save(function(err){
        if (err){
            return next(err);
        }else {
            res.json(user);
        }
    });
};

exports.list = function(req, res, next){
    User.find({}, function(err, users) {
        if (err) {
            return next(err);
        }else {
            users.forEach(function(user) {
                console.log("user: " + user);
            });
            res.json(users);
        }
    });
};

exports.read = function(req, res){
    console.log("read");
    res.json(req.user);
};

exports.userByID = function (req, res, next, id) {
    //req.user contains the current;ly logged in user, req.body contains the request contents (also a user).
    //this function finds the user by the url id and replaced req.user with this. req.body doesn't change.
    console.log("userByID: " + id);
    console.log("userById req.body before: " + JSON.stringify(req.body));
    console.log("userBy Id req.user " + req.user);
    User.findOne({_id: id}, function(err,user){
        if (err) {
            return next(err);
        }else {
            req.user = user;
            next();
        }
    });
};


exports.add = function (req, res, next){
    //not currently in use...
    var user = req.user;
    var id = req.body.userID;
    console.log("req.body: " + JSON.stringify(req.body));
    user.update(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(user);
        }
    });
}


exports.update = function(req, res, next){
    //console.log("update req.body: " + JSON.stringify(req.body));
    //console.log("update req.user: " + req.user);
    User.findByIdAndUpdate(req.user.id, req.body, function(err, user){
        if (err) {
            return next(err);
        } else {
            res.json(user);
        }
    });
};

exports.delete = function(req, res, next){
    req.user.remove(function(err){
        if (err) {
            return next(err);
        } else {
            res.json(req.user);
        }
    })
};

var getErrorMessage = function(err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].
                message;
        }
    }
    return message;
};

exports.renderSignin = function(req, res, next) {
    if (!req.user) {
        res.render('signin', {
            title: 'Sign-in Form',
            messages: req.flash('error') || req.flash('info')
        });
    } else {
        return res.redirect('/');
    }
};
exports.renderSignup = function(req, res, next) {
    if (!req.user) {
        res.render('signup', {
            title: 'Sign-up Form',
            messages: req.flash('error')
        });
    } else {
        return res.redirect('/');
    }
};
exports.signup = function(req, res, next) {
    if (!req.user) {
        var user = new User(req.body);
        var message = null;
        user.provider = 'local';
        user.save(function(err) {
            if (err) {
                var message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/signup');
            }
            req.login(user, function(err) {
                if (err) return next(err);
                return res.redirect('/');
            });
        });
    } else {
        return res.redirect('/');
    }
};
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.status(401).send({
            message: 'User is not logged in'
        });
    }
    next();
};