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

var user, user2, user3, retrievedUser, log, log2, log3,
    agent = request.agent(app);

describe('Interaction controller unit tests 2 friends:', function(){

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

        log2 = new Interaction({instigator:user2.id,
            target: user.id,
            description: "this is a test log",
            level: -3
        });

        log3 = new Interaction({instigator:user.id,
            target: user2.id,
            description: "this is a test log",
            level: 3
        });

        var f = function () {
            createUserInDB(user, function(){
                createUserInDB(user2, function(){
                    makeFriendship(user, user2, done)
                });
            });
        }();

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
            });
    });

    describe('Testing working with logs', function(done){
        beforeEach(function(done){
            agent.post('/signin')
                .send({"username": user.username, "password": user.password})
                .expect(302)
                .expect('Location','/')
                .end(function (err, res){
                    agent.post('/api/interactions')
                        .send(log)
                        .expect(200)
                        .end(function(err, res){
                            agent.post('/api/interactions')
                                .send(log2)
                                .expect(200)
                                .end(function(err, res){
                                    agent.post('/signin')
                                        .send({"username": user2.username, "password": user2.password})
                                        .end(function(err, res){
                                            agent.post('/api/interactions')
                                                .send(log3)
                                                .expect(200)
                                                .end(function(err, res){
                                                done();
                                            });
                                        });
                                });
                        });
                });
        });

        it('should be able to return a full list of interactions for a logged in user', function(done){
            agent.get('/api/interactions')
                .expect(200)
                .end(function(err, res){
                    should.not.exist(err);
                    res.body.should.be.an.Array.and.have.length(3);
                    res.body[0].should.be.an.Object.and.have.property('instigator');
                    res.body[0].should.be.an.Object.and.have.property('target');
                    res.body[0].should.be.an.Object.and.have.property('level');
                    done();
                });
        });

        it('should be able to return a score object', function(done){
            agent.get('/api/interactions/score/stats')
                .expect(200)
                .end(function(err, res){
                    should.not.exist(err);
                    res.body.should.be.an.Object;
                    done();
                });
        });
        it('should be able to return a score object with correct value of userBalance', function(done){
            agent.get('/api/interactions/score/stats')
                .expect(200)
                .end(function(err, res){
                    should.not.exist(err);
                    res.body.should.be.an.Object.and.have.property('userBalance',-2);
                    done();
                });
        });

        it('should be able to return a score object with correct value of userBalance and friendBalance', function(done){

            agent.get('/api/interactions/score/stats/' + user.id)
                .expect(200)
                .end(function(err, res){
                    should.not.exist(err);
                    res.body.should.be.an.Object.and.have.property('userBalance',-2);
                    res.body.should.be.an.Object.and.have.property('friendBalance',3);
                    done();
                });
        });

    });



    afterEach(function(done){
        request(app).get('/signout')
            .end(function(err, res) {
                User.remove().exec(function () {
                    Interaction.remove().exec(function () {
                        done();
                    });
                });
            });

    });



});

describe('Interaction controller unit tests 3 friends:', function() {

    beforeEach(function (done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'Tom',
            password: 'password'
        });
        user2 = new User({
            firstName: 'Full2',
            lastName: 'Name2',
            displayName: 'Full Name2',
            email: 'test2@test.com',
            username: 'Dick',
            password: 'password'
        });
        user3 = new User({
            firstName: 'Full2',
            lastName: 'Name2',
            displayName: 'Full Name2',
            email: 'test2@test.com',
            username: 'Harry',
            password: 'password'
        });


        log = new Interaction({
            instigator: user2.id,
            target: user.id,
            description: "this is a test log between 1st and 2nd user",
            level: 1
        });

        log2 = new Interaction({
            instigator: user.id,
            target: user2.id,
            description: "this is a test log between 2nd and 1st user",
            level: -3
        });

        log3 = new Interaction({
            instigator: user3.id,
            target: user.id,
            description: "this is a test log between 1st and 3rd user",
            level: 3
        });

        var f = function () {
            createUserInDB(user, function(){
                createUserInDB(user2, function(){
                    makeFriendship(user, user2, make3rdUserAndFriendship)
                });
            });
        }();

        var make3rdUserAndFriendship = function () {
                createUserInDB(user3, function(){
                    makeFriendship(user, user3, setUpLogs)
            });
        };

        var setUpLogs = function(){
            agent.post('/signin')
                .send({"username" : user.username, "password" : user.password})
            agent.post('/api/interactions')
                .send(log)
                .expect(200)
                .end(function(err, res){
                    agent.post('/api/interactions')
                        .send(log3)
                        .expect(200)
                        .end(function(err, res){
                            agent.post('/signin')
                                .send({"username": user2.username, "password": user2.password})
                                .end(function(err, res){
                                    agent.post('/api/interactions')
                                        .send(log2)
                                        .expect(200)
                                        .end(function(err, res){
                                            done();
                                        });
                                });
                        });
                });
        };

    });
    it ('also should not crash during before each hook!',function(){

    });


    afterEach(function(done){
        User.remove().exec(function(){
            Interaction.remove().exec(function(){
                done();
            });
        });

    });

});

var acceptFriendRequest = function(user, user2, cb){
    var route = '/api/pendingfriends/' + user.id;
    agent.post('/signin')
        .send({"username": user.username, "password": user.password})
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
                        agent.get('/signout')
                            .expect(302)
                            .end(function(err,res){
                                should.not.exist(err);
                                cb();
                            });
                    });
            });
        });
};


var requestFriendship = function(user,user2,cb){
    User.findOne({_id : user2.id}).exec(function(err, user){
        //User.find().exec(function(err, user){
        retrievedUser = user;
        retrievedUser.pendingFriends.push(user.id);
        //    user.forEach(function(u){
        //        console.log(u);
        //    });
        //console.log("username: " + user2.username);
        //console.log("password: " + user2.password);
        var route = '/api/users/' + user2.id;
        agent.post('/signin')
            .send({"username" : user2.username, "password" : user2.password})
            .expect(302)
            .expect('Location','/')
            .end(function(err, res){
                should.not.exist(err);
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

var createUserInDB = function(user, cb){
    agent.post('/signup')
        .send(user)
        .end(function (err, res) {
            if (err) {
                console.log("Error signup: " + user.username + " : " + err);
            }
            agent.get('/signout')
                .end(function (err, res) {
                    should.not.exist(err);
                    cb();
                });
        });
};




var makeFriendship = function (user1, user2, cb){
    var f3 = function () {
            requestFriendship(user1, user2, function(){
                acceptFriendRequest(user1, user2, cb);
            });

    }();
};