/**
 * Created by GB115151 on 09/05/2016.
 */
var User = require('mongoose').model('User'),
    passport = require('passport');

exports.add = function(req, res) {
    console.log("exports.add: " + JSON.stringify(req.body));
    User.findById(req.body.id).exec(function(err, friend) {
        if (err) return next(err);
        friend.pendingFriend.push(req.user.__id);
        res.json(friend);
    });

};

exports.accept = function(req,res){

};

exports.decline = function(req,res){

};

exports.list = function(req,res){
    User.findById(req.body.id).populate('friends').exec(function(err, friends) {
        if (err) {
            return next(err);
        }else {
            friends.forEach(function(user) {
                console.log("user: " + user);
            });
            res.json(friends);
        }
    });

};

exports.hasAuthorization = function(req, res, next){
//    if the friendId exists in the user's friend list then go to next, otherwise
    var friendInList = false;
    friendInList = req.user.friends.some(function(friend){
        return (friend._id === req.friend.__id);
    });
    if (!friendInList){
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }else{
        next();
    }
};

