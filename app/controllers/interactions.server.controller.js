/**
 * Created by GB115151 on 29/04/2016.
 */
'use strict';
var mongoose = require("mongoose"),
    Interaction = mongoose.model('Interaction'),
    Utils = require('../controllers/utils2');

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
    Interaction.find()
        .populate('target','username firstName lastName fullName')
        .populate('instigator','username firstName lastName fullName')
        .exec(function(err, logs){
        if (err) {
            console.log("list err: " + err);
            return res.send(err);
        } else {
            //console.log("logs before filter: " + JSON.stringify(logs));
            var logsfilt = Utils.filterForRelevance(logs, req.user, req.friend);
            logsfilt.sort(function(a,b){
                return (b.created.getTime() - a.created.getTime())
            });
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
                //console.log("req.user.friends: " + JSON.stringify(req.user.friends));
                var logsfilt = Utils.filterForRelevance(logs, req.friend, req.friend2);
                logsfilt = Utils.hideNames(logsfilt,req.user);
                logsfilt.sort(function(a,b){
                    return (b.created.getTime() - a.created.getTime())
                });

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
            var logsFilt = Utils.filterForRelevance(logs, person1, person2);
            var userBalance = 0;
            var friendBalance = 0;
            logsFilt
                .filter(function(log){
                    return log.instigator.id === person1.id
                })
                .forEach(function(a){
                        userBalance = userBalance + a.level;
            });
            if (person2){
                logsFilt
                    .filter(function(log){
                        return log.instigator.id === person2.id
                    })
                    .forEach(function(a){
                        friendBalance = friendBalance + a.level;
                    });
            }
            res.json({
                userBalance: userBalance,
                friendBalance: friendBalance
            });
        }
    });
};

exports.scoreTwo = function(req, res, next){

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