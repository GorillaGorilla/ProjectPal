/**
 * Created by GB115151 on 16/06/2016.
 */
"use strict";
var app = require('../../server'),
    request = require('supertest'),
    should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Interaction = mongoose.model('Interaction');

var user, user2, retrievedUser, log,
    agent = request.agent(app);

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

        var func = function (){

        }();

        log = new Interaction({instigator:user2.id,
            target: user.id,
            description: "this is a test log",
            level: 1
        });

        makeFriendship(user, user2, done);

    });
    it('should not crash during before hook!', function(){

    });

    it('should be able to create an interaction between 2 friends', function(done){
        agent.post('/signin')
            .send({"username": user.username, "password": user.password})
            .expect(302)
            .expect('Location','/')
            .end(function (err, res){
                agent.post('/api/interactions')
                    .send(log)
                    .expect(200)
                    .end(function(err, res){
                        if (err){console.log("creaate interaction err: " + err)}
                        res.body.should.be.an.Object.and.have.property('creator', user.id);
                        res.body.should.have.property('description', log.description);
                        res.body.should.have.property('target', user.id);
                        res.body.should.have.property('instigator', user2.id);
                        done();
                    });
            })

    });

    afterEach(function(){
        User.remove().exec();
        Interaction.remove().exec();
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
    var f = function () {
        create2Users(user1, user2, function(){
            requestFriendship(user1, user2, function(){
                acceptFriendRequest(user1, user2, cb);
            });
        });
    }();
};