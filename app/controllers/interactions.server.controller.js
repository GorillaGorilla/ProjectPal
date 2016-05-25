/**
 * Created by GB115151 on 29/04/2016.
 */
var mongoose = require("mongoose"),
    Interaction = mongoose.model('Interaction');

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
    console.log("userID: " + req.user.id);

    Interaction.find()
        .populate('target','username firstName lastName fullName')
        .populate('instigator','username firstName lastName fullName')
        .exec(function(err, logs){
        if (err) {
            console.log("list err: " + err);
            return res.send(err);
        } else {
            console.log("logs before filter: " + JSON.stringify(logs));
            var logsfilt = logs.filter(function(log){
                return (log.instigator.id === req.user.id || log.target.id === req.user.id)
            });
            console.log("logs after filter: " + JSON.stringify(logs));
            res.json(logsfilt);
        }
    });
}



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