/**
 * Created by GB115151 on 29/04/2016.
 */
var mongoose = require("mongoose"),
    Interaction = mongoose.model('Interaction');
var relevantInteraction = function(person1, person2, log){
    if(!!person2){
        return (log.instigator.id === person1.id && log.target.id === person2.id || log.target.id === person1.id && log.instigator.id === person2.id)
    }else{
        return (log.instigator.id === person1.id || log.target.id === person1.id)
    }
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

    //console.log("interactions: " + interaction);

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
    var person1;
    var person2;
    person1 = req.user;
    person2 = req.friend || null;
    Interaction.find()
        .populate('target','username firstName lastName fullName')
        .populate('instigator','username firstName lastName fullName')
        .exec(function(err, logs){
        if (err) {
            console.log("list err: " + err);
            return res.send(err);
        } else {
            //console.log("logs before filter: " + JSON.stringify(logs));
            var logsfilt = logs.filter(function(log){
                return relevantInteraction(person1, person2, log);
            });
            res.json(logsfilt);
        }
    });
};

exports.listFriendLogs = function(req, res){
    console.log("list friend log called");

    var person1;
    var person2;

    person1 = req.friend;
    person2 = req.friend2 || null;
    console.log("person1: " + person1.username);
    if (person2){
        console.log("person2: " + person2.username);
    }

    Interaction.find()
        .populate('target','username firstName lastName fullName')
        .populate('instigator','username firstName lastName fullName')
        .exec(function(err, logs){
            if (err) {
                console.log("list err: " + err);
                return res.send(err);
            } else {
                //console.log("logs before filter: " + JSON.stringify(logs));
                var logsfilt = logs.filter(function(log){
                    return relevantInteraction(person1, person2, log);
                    //return (log.instigator.id === req.user.id || log.target.id === req.user.id)
                }).map(function(log){
                    // if req.user.friends !contains then
                    log.instigator = 'mystery';
                    log.target = 'mystery';
                    return log;
                });
                res.json(logsfilt);
            }
        });
};

exports.getScore = function(req, res){
    Interaction.find().exec(function(err,logs){
        if (err) {
            console.log("list err: " + err);
            return res.send(err);
        } else {
            var logsFilt = logs.filter(function(log){
                return relevantInteraction(req, log);
            });
            var userBalance = 0;
            logsFilt.filter(function(log){
                return (log.instigator.id === req.user.id);
            }).forEach(function(log){
                userBalance += log.score;
            });

            var friendBalance = 0;
            logsFilt.filter(function(log){
                return (log.instigator.id === req.friend.id);
            }).forEach(function(log){
                friendBalance += log.score;
            });
            res.json({
                userBalance: userBalance,
                friendbalance: friendBalance
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