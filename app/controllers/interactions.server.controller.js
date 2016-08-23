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


exports.listLogs = function(req, res, next){
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
                req.interactions = logsfilt;
                next();
            }
        });
};

exports.returnLogs = function(req, res){
    if (req.interactions){
        res.json(req.interactions);
    }else{
        var err = "no working";
        res.send(err);
    }
};

exports.scoreTwo = function(req, res, next){
    var historyLength = req.query.time || 7;
    var userHistory = Utils.calcScoreArray(req.interactions, req.friend, historyLength);
    var friendHistory = req.friend2 ? Utils.calcScoreArray(req.interactions, req.friend2, historyLength) : [];
    res.json({
        userBalance: userHistory[userHistory.length-1] || 0,
        userHistory: userHistory,
        friendBalance: friendHistory[userHistory.length-1] || 0,
        friendHistory: friendHistory
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