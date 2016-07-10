/**
 * Created by GB115151 on 16/06/2016.
 */
var app = require('../../server'),
    request = require('supertest'),
    should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Interaction = mongoose.model('Interaction'),
    interactionController = require('../controllers/interactions.server.controller');

describe('Interaction controller unit tests:', function(){
    beforeEach(function(done){
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });
        user2 = new User({
            firstName: 'Full2',
            lastName: 'Name2',
            displayName: 'Full Name2',
            email: 'test2@test.com',
            username: 'username2',
            password: 'password'
        });

        makeFriendship(user, user2, done);

    });


    describe('Testing the testLogRelevance method', function(){

    });



});

var acceptFriendRequest = function(user, user2, cb){
    var route = '/api/pendingfriends/' + user.id;
    agent.post('/signin')
        .send({"username": user2.username, "password": user2.password})
        .expect(302)
        .expect('Location','/')
        .end(function (err, res){
            if(err){console.log("Error signin: " + err);}
            User.findOne({_id : user.id}).exec(function(err, user) {
                retrievedUser = user;
                agent.put(route)
                    .send(user)
                    .set('Accept','application/json')
                    .expect(200)
                    .end(function(err,res){
                        cb();
                    });
            });
        });
};


var requestFriendship = function(user,user2,cb){
    User.findOne({_id : user2.id}).exec(function(err, user){
        retrievedUser = user;
        retrievedUser.pendingFriends.push(user.id);
        //console.log("user2 retreived: " + retrievedUser);
        var route = '/api/users/' + user2.id;
        agent.put(route)
            .send(retrievedUser)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
                if (err) {console.log("add friend err: " + err);}
                agent.get('/signout')
                    .end(function(err, res) {
                        if (err){"signout err: " + err}
                        cb();
                    });
            });
    });
};

var create2Users = function(user, user2, cb){
    agent.post('/signup')
        .send(user)
        .end(function (err, res) {
            if(err){console.log("Error first signup: " + err);}
            agent.get('/signout')
                .end(function(err, res) {
                    agent.post('/signup')
                        .send(user2)
                        .end(function(err, res){
                            if(err){console.log("Error second signup: " + err);}
                            agent.get('/signout')
                                .end(function(err, res){
                                    agent.post('/signin')
                                        .send({ "username": "username", "password": "password" })
                                        .end(function (err, res){
                                            if(err){console.log("Error signin: " + err);}
                                            cb();

                                        });
                                });
                        });
                });

        });
};

var makeFriendship = function (user1, user2, cb){
    create2Users(user1, user2,
        requestFriendship(user1,user2,
            acceptFriendRequest(user1, user2, cb)));
};