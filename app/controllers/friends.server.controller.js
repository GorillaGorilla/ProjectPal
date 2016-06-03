/**
 * Created by GB115151 on 09/05/2016.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User');


exports.add = function(req, res) {
    //not actually needed... works with users update

    User.findOne({_id: req.body.id}).exec(function(err, friend) {
        if (err) {console.log(err);
        res.send(err)}
        //console.log("findOne friend: " + friend);
        friend.pendingFriends.push(req.user.id);
        //using save will probably mess up passport/logging in... revisit if needed
        friend.save(function(err){
            res.json(friend);
        });
    });

};

exports.accept = function(req,res){
    // adds user to the friends friend array, and friend to the user's friend array. deleted friend from
    // user's pending list

    req.user.friends.push(req.body.id);
    var index = req.user.pendingFriends.indexOf(req.body.id);
    req.user.pendingFriends.splice(index);

    User.findByIdAndUpdate(req.user.id, req.user, function(err, user){
        if (err) {
            return res.send(err);
        } else {
            req.friend.friends.push(req.user.id);
            User.findByIdAndUpdate(req.body.id, req.friend, function(err, user){
                if (err) {
                    console.log("findupdate error: " + err)
                    return res.send(err);
                } else {
                    res.json(user);
                }
            });
        }
    });
};

exports.read = function(req,res, id){

};

exports.decline = function(req,res){

};

exports.list = function(req,res){
    // returns an object of 2 arrays, friends and pending friends
    console.log("list called");
    User.findById(req.user.id).populate('friends', 'username firstName lastName fullName email')
        .populate('pendingFriends', 'username firstName lastName fullName email')
        .exec(function(err, user) {
        if (err) {
            console.log("list err: " + err);
            res.send(err);
        }else {
            console.log('user populated: ' + user);
            var friends, pending;
            friends = user.friends;
            pending = user.pendingFriends;
            pending.forEach(function(record){
                record.pending = true;
            });
            friends.forEach(function(record){
                record.pending = false;
            });
            res.json(friends);
        }
    });

};

exports.listpending = function(req,res){
    console.log("listPending called");

    User.findById(req.user.id)
        .populate('pendingFriends', 'username firstName lastName fullName email')
        .exec(function(err, user) {
            if (err) {
                console.log("list err: " + err);
                res.send(err);
            } else {
                res.json(user.pendingFriends);
            }
        });
};

exports.friendById = function(req, res, next, id){
    console.log("friendById called");
    User.findOne({_id: id}, function(err,friend){
        if (err) {
            return next(err);
        }else {
            req.friend = friend;
            next();
        }
    });
};

exports.friendWfriendsById = function(req, res, next, id){
    console.log("friendWfriendsById called");
    User.findById(id)
        .populate('friends','username')
        .exec(function(err,friend){
        if (err) {
            return next(err);
        }else {
            req.friend = friend;
            next();
        }
    });
};

exports.friend2WfriendsById = function(req, res, next, id){
    console.log("friend2WfriendsById called");
    User.findById(id)
        .populate('friends','username')
        .exec(function(err,friend){
            if (err) {
                return next(err);
            }else {
                req.friend2 = friend;
                next();
            }
        });
};


exports.hasFriendship = function(req,res,next){
    if (req.user.friends.indexOf(req.friend.id) === -1){
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }else {
        next();
    }

};

exports.hasAuthorization = function(req, res, next){
//    if the friendId exists in the user's friend list then go to next, otherwise
    var friendInList = false;
    friendInList = req.user.friends.some(function(friend){
        return (friend._id === req.friend._id);
    });
    if (!friendInList){
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }else{
        next();
    }
};

