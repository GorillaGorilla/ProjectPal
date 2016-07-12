/**
 * Created by Frederick on 24/03/2016.
 */
var mongoose = require('mongoose'),
    crypto = require('crypto'),
    In = require('./interaction.server.model.js'),
    Schema = mongoose.Schema
    Interaction = mongoose.model('Interaction');

var UserSchema = new Schema({
    firstName: String,
    lastName: String,
    //friends: [{
    //    person: {type: Schema.ObjectID, ref: User},
    //    status: {type: String,
    //    default: 'Pending'}
    //}],
    email: {
        type: String,
        match: [/.+\@.+\..+/, "Please fill a valid e-mail address"]
    },
    username: {
        type: String,
        unique: true,
        required: 'Username is required',
        trim: true
    },
    password: {
        type: String,
        validate: [
            function(password) {
                return password && password.length > 6;
            }, 'Password should be longer'
        ]
    },
    salt: {
        type: String
    },
    provider: {
        type: String,
        required: 'Provider is required'
    },
    providerId: String,
    providerData: {},
    created: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default : Date.now
    }
});
UserSchema.add({friends: [{ type : Schema.ObjectId, ref: 'User' }]});
UserSchema.add({pendingFriends: [{ type : Schema.ObjectId, ref: 'User' }]});

UserSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName;
}).set(function(fullName) {
    var splitName = fullName.split(' ');
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
});
UserSchema.pre('save', function(next) {
    if (this.password) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

UserSchema.methods.getScore = function(friendId){
    //not tested
    Interaction.find().exec(function(err, logs){
        if (err) {
            console.log("list err: " + err);
            return res.send(err);
        } else {
            var score = 0;
            //console.log("logs before filter: " + JSON.stringify(logs));
            var logsfilt = logs.filter(function(log){
                return relevantInteraction(this, friendId, log);
                //return (log.instigator.id === req.user.id || log.target.id === req.user.id)
            }).filter(function(log){
                return log.instigator === friendId;
            }).forEach(function(log){
                score += log.level;
            });
            return score;
        }
    });

    var relevantInteraction = function(person1, person2, log){
        if(!!person2){
            return (log.instigator.id === person1 && log.target.id === person2 || log.target.id === person1 && log.instigator.id === person2)
        }else{
            return (log.instigator.id === person1 || log.target.id === person1)
        }
    };
};
UserSchema.methods.hashPassword = function(password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000,64).toString('base64');
};
UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');
    _this.findOne({
        username: possibleUsername
    }, function(err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) +
                    1, callback);
            }
        } else {
            callback(null);
        }
    });
};
UserSchema.set('toJSON', {
    getters: true,
    virtuals: true
});
mongoose.model('User', UserSchema);
