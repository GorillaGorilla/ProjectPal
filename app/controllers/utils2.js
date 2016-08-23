/**
 * Created by GB115151 on 18/07/2016.
 */
'use strict'

exports.filterForRelevance = function(logs, person1, person2){

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

    if (logs.length === 0) {return []}
    var result = logs.filter(function(log){
        var args  = [];
        args.push(person1);
        if (person2){args.push(person2)}
        args.push(log);
        return testLogRelevance.apply(null, args);
    });
    return result;

};

exports.hideNames = function(logs, userObj){
    logs
        .map(function(log){
            //console.log("log: " + JSON.stringify(log));
            if ((userObj.friends.indexOf(log.instigator.id) === -1
                && log.instigator.id !== userObj.id)){
                log.instigator.username = 'mystery';
                log.instigator.firstName = 'mystery';
                log.instigator.lastName = 'mystery';
                log.instigator.displayName = 'mystery';
            }
            if ((userObj.friends.indexOf(log.target.id) === -1
                && log.target.id !== userObj.id)){
                log.instigator.username = 'mystery';
                log.instigator.firstName = 'mystery';
                log.instigator.lastName = 'mystery';
                log.instigator.displayName = 'mystery';
            }
        });
    return logs;
};

exports.calcScoreArray = function(logs, userObj, histLength){
    var d = new Date();
    var result = [];
    for (var i = 0; i < histLength; i++){
        var histBalance = 0
        logs.filter(function(log){
            //change to work with miliseconds
            // console.log("log created: " + log.created);
            // console.log("(d.getDate()-(7-i): " + (d.getDate()-(7-i)));
            return log.created.getTime() < (d.getTime()-(histLength-1-i)*3600*1000*24);
        }).filter(function(log){
            return log.instigator.id === userObj.id
        })
            .forEach(function(a){
                histBalance = histBalance + a.level;
            });
        result[i] = histBalance;
    };
    return result;
};

exports.sendMail = function(log){
    var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
    console.log("log: " + log);

    var transporter = nodemailer.createTransport('smtps://palanalst@gmail.com:89Palbert@smtp.gmail.com'),
        msgText = log.creator.firstName+ " logged that you " + log.description + "!",
        subjectLine = "",
        recipient = log.instigator.email;

    if (log.level > 0){
        subjectLine = "You betrayed " + log.target.username + "!";
    }else{
        subjectLine = "You were a good pal to " + log.target.username + "!"
    }

// setup e-mail data with unicode symbols
    var mailOptions = {
        from: '"Pally 👥" <donotreply@stuart.com>', // sender address
        to: recipient, // list of receivers
        subject: subjectLine, // Subject line
        text: msgText, // plaintext body
        html: '<b>' + msgText +'</b>' // html body
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
};

