/**
 * Created by frederickmacgregor on 11/09/2016.
 */

var nodemailer = require('nodemailer');

exports.sendMail = function(log){


// create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport('smtps://palanalst@gmail.com:89Palbert@smtp.gmail.com'),
        msgText = log.creator.firstName + " logged that you " + log.description + "!",
        subjectLine = "",
        recipient = log.instigator.email;

    if (log.level > 0){
        subjectLine = "You betrayed " + log.target.username + "!";
    }else{
        subjectLine = "You were a good pal to " + log.target.username + "!"
    }

    var mailOptions = {
        from: '"Pally 👥" <donotreply@stuart.com>',
        to: recipient,
        subject: subjectLine,
        text: msgText,
        html: '<b>' + msgText +'</b>'
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
};