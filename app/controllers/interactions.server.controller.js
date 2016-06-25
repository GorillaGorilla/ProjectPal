/**
 * Created by GB115151 on 29/04/2016.
 */
var mongoose = require("mongoose"),
    Interaction = mongoose.model('Interaction');

var RELEVANCE = {};

var testLogRelevance = function(){
    var args = Array.prototype.slice.call(arguments);
    //console.log("args: " + args + '\n' + '-------');
    var oneWay = function(){
        return (log.instigator.id === person1.id && log.target.id === person2.id);
    };
    var inverseWay = function(){
        return (log.target.id === person1.id && log.instigator.id === person2.id);
    };

    if (args.length === 3){
        var log = args[2];
        var person1 = args[0];
        var person2 = args[1];
        return (oneWay()|| inverseWay())
    }else if (args.length ===2 ){
        return (args[1].instigator.id === args[0].id || args[1].target.id === args[0].id)
    }
};

RELEVANCE.filterForRelevance = function(logs, person1, person2){


    var result = logs.filter(function(log){
        var args  = [];
        args.push(person1);
        if (person2){args.push(person2)}
        args.push(log);
        return testLogRelevance.apply(null, args);
    });
    return result;
};





// make it a generic function, with first person, 2nd person. Then have the logic if user only, then user = first person.
// if friend then user and friend.
// if friend and... then friend only
// if friend and friend2 then list stuff... but only the ones who are mutual friends...

// in this case maybe have a function for user and friend, then another for viewing friends

exports.create = function(req, res) {
    //console.log("create interaction body: " + JSON.stringify(req.body) + '\n');

    var interaction = new Interaction(req.body);
    interaction.creator = req.user;
    interaction.save(function(err) {
        if (err) {
            console.log("error: " + err);
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(interaction);
        }
    });
};


var getErrorMessage = function(err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return 'Unknown server error';
    }
};

exports.list = function(req, res){
    console.log("list called");

    Interaction.find()
        .populate('target','username firstName lastName fullName')
        .populate('instigator','username firstName lastName fullName')
        .exec(function(err, logs){
        if (err) {
            console.log("list err: " + err);
            return res.send(err);
        } else {
            //console.log("logs before filter: " + JSON.stringify(logs));
            var logsfilt = RELEVANCE.filterForRelevance(logs, req.user, req.friend);
            res.json(logsfilt);
        }
    });
};

exports.listFriendLogs = function(req, res){
    console.log("list friend log called");
    Interaction.find()
        .populate('target','username firstName lastName fullName')
        .populate('instigator','username firstName lastName fullName')
        .exec(function(err, logs){
            if (err) {
                console.log("list err: " + err);
                return res.send(err);
            } else {
                //console.log("logs before filter: " + JSON.stringify(logs));
                var logsfilt = RELEVANCE.filterForRelevance(logs, req.friend, req.friend2);
                //    .map(function(log){
                //    // if req.user.friends !contains then
                //    log.instigator = 'mystery';
                //    log.target = 'mystery';
                //    return log;
                //});
                res.json(logsfilt);
            }
        });
};

exports.getScore = function(req, res){
    Interaction.find()
        .populate('target','username firstName lastName fullName')
        .populate('instigator','username firstName lastName fullName')
        .exec(function(err,logs){
        if (err) {
            console.log("list err: " + err);
            return res.send(err);
        } else {
            var person1 = (!req.friend2) ? req.user : req.friend;
            var person2 = req.friend2 || req.friend;

            var logsFilt = RELEVANCE.filterForRelevance(logs, person1, person2);
            var userBalance = 0;
            var friendBalance = 0;
            console.log("logs filt1: " + logsFilt)

            logsFilt
                .forEach(function(a){
                    if (a.instigator.id === req.user.id){
                        userBalance = userBalance + a.level;
                    }else{
                        friendBalance += a.level;
                    }

            });

            //    .reduce(function(a, b){
            //    return a.level + b.level;
            //});


            //logsFilt.filter(function(log){
            //    return (log.instigator.id === req.friend.id);
            //}).forEach(function(log){
            //    friendBalance += log.score;
            //});
            res.json({
                userBalance: userBalance,
                friendBalance: friendBalance
            });
        }
    });

};



exports.interactionByID = function(req, res, next, id) {
    Interaction.findById(id).populate('creator', 'firstName lastName fullName')
        .populate('target', 'username firstName lastName fullName')
        .populate('instigator', 'username firstName lastName fullName')
        .exec(function(err, interaction) {if (err) return next(err);
        if (!interaction) return next(new Error('Failed to load interaction ' + id));
        req.interaction = interaction;
        next();
    });
};