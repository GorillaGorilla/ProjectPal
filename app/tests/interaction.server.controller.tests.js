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

var user, user2, user3, retrievedUser, log, log2, log3,log4,log5,
    agent = request.agent(app);

describe('Interaction controller unit tests:', function(){
    beforeEach(function(done){
        //console.log("beforeEach1");
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
        done();
    });

    describe('sacrificial describe required for socket???',function(done){
        beforeEach(function(done){
            var f = function () {
                createUserInDB(user, function(){
                    createUserInDB(user2, function(){
                        makeFriendship(user, user2, done)
                    });
                });
            }();
        });
        it('should crash on before each for some reason', function(done){
            done();
        });
    });

    describe('tests 2 friends:', function(){
        beforeEach(function(done){

            log = new Interaction({instigator:user2.id,
                target: user.id,
                description: "this is a test log1",
                level: 1
            });

            log2 = new Interaction({instigator:user2.id,
                target: user.id,
                description: "this is a test log2",
                level: -3
            });

            log3 = new Interaction({instigator:user.id,
                target: user2.id,
                description: "this is a test log3",
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
                    makeFriendship(user, user3, done)
                });
            };

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
                            })
                    });
            });

            it('should be able to return a full list of logs for a logged in user', function(done){
                agent.get('/api/interactions/' + user2.id)
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

            //it('should return a list of logs in decending order of creation', function(done){
            //    agent.post('/signin')
            //        .send({"username" : user.username, "password" : user.password})
            //        .expect(302)
            //        .expect('Location','/')
            //        .end(function(err, res){
            //            agent.get('/api/interactions')
            //                .expect(200)
            //                .end(function(err, res){
            //                    should.not.exist(err);
            //                    res.body.should.be.an.Array.and.have.length(3);
            //                    res.body.forEach(function(log){
            //                        console.log("log: " + log.description + ' ' + log.created);
            //                    });
            //                    var correctOrder = new Date(res.body[0].created) > new Date(res.body[1].created);
            //                    correctOrder.should.be(true);
            //
            //                    //res.body[0].should.be.an.Object.and.have.property('description',log3.description);
            //                    //res.body[1].should.be.an.Object.and.have.property('description',log2.description);
            //                    //res.body[2].should.be.an.Object.and.have.property('description',log.description);
            //                    done();
            //                });
            //        });
            //});

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
    });

    describe('tests 3 friends:', function() {

        beforeEach(function (done) {
            //console.log("beforeEach2");
            var date = new Date();
            var d = new Date();
            date.setDate(d.getDate()- 6);
            log = new Interaction({
                instigator: user2.id,
                target: user.id,
                description: "this is a test log between 1st and 2nd user",
                level: 1,
                created: date.getTime()
            });
            date.setDate(d.getDate()- 3);

            log2 = new Interaction({
                instigator: user.id,
                target: user2.id,
                description: "this is a test log between 2nd and 1st user",
                level: -3,
                created: date.getTime()
            });
            date.setDate(d.getDate()- 2);
            log3 = new Interaction({
                instigator: user3.id,
                target: user.id,
                description: "this is a test log between 1st and 3rd user",
                level: 3,
                created: date.getTime()
            });
            date.setDate(d.getDate()- 2);
            log4 = new Interaction({
                instigator: user2.id,
                target: user.id,
                description: "this is a test log between 1st and 3rd user",
                level: 1,
                created: date.getTime()
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
                //it is not required to use the route to set up the logs,
                //could be changed to simply use the save method and should still work

                log.save(function(err) {
                    if (err){console.log("save error; " + err)};
                    should.not.exist(err);
                    log2.save(function(err) {
                        if (err){console.log("save error; " + err)};
                        should.not.exist(err);
                        log3.save(function(err) {
                            if (err){console.log("save error; " + err)};
                            should.not.exist(err);
                            log4.save(function(err) {
                                if (err){console.log("save error; " + err)};
                                should.not.exist(err);
                                done();
                            });
                        });
                    });
                });
            };



        });
        it ('also should not crash during before each hook!',function(){

        });

        it ('should be able to return the correct scores for different users',function(done){
            agent.post('/signin')
                .send({"username" : user2.username, "password" : user2.password})
                .expect(302)
                .expect('Location', '/')
                .end(function(err, res){
                    agent.get('/api/interactions/score/stats/' + user.id)
                        .expect(200)
                        .end(function(err, res){
                            should.not.exist(err);
                            res.body.should.be.an.Object.and.have.property('userBalance',2);
                            res.body.should.be.an.Object.and.have.property('friendBalance',-3);
                            done();
                        });
                });
        });

        it('should be able to return an array of cummulative score per day',function(done){
            agent.post('/signin')
                .send({"username" : user2.username, "password" : user2.password})
                .expect(302)
                .expect('Location','/')
                .end(function(err,res){
                    should.not.exist(err);
                    agent.get('/api/interactions/score/stats/' + user.id)
                        .expect(200)
                        .end(function(err,res){
                            should.not.exist(err);
                            res.body.userHistory.should.be.an.Array.and.have.length(7);
                            res.body.userHistory[6].should.equal(2);
                            res.body.friendHistory.should.be.an.Array.and.have.length(7);
                            res.body.friendHistory[6].should.equal(-3);
                            done();
                        });
                });
        });


        it('should not be able to return scores if the user isn\'t logged in',function(done){
            agent.get('/signout')
                .expect(302)
                .expect('Location','/')
                .end(function(err, res){
                    agent.get('/api/interactions/score/stats/' + user.id)
                        .expect(401)
                        .end(function(err, res){
                            should.not.exist(err);
                            done();
                        });
                });
        });

        it('should be able to retrieve a list of logs for a chosen friend', function(done){
            agent.post('/signin')
                .send({"username" : user.username, "password" : user.password})
                .expect(302)
                .expect('Location', '/')
                .end(function(err, res){
                    agent.get('/api/interactions/' + user2.id + '/show')
                        .expect(200)
                        .end(function(err, res){
                            should.not.exist(err);
                            res.body.should.be.an.Array.and.have.length(3);
                            done();
                        });
                });
        });


        it('should be able to retrieve a list of logs for a 2 friends', function(done){
            agent.post('/signin')
                .send({"username" : user.username, "password" : user.password})
                .expect(302)
                .expect('Location', '/')
                .end(function(err, res){
                    agent.get('/api/interactions/' + user.id + '/show/' + user2.id)
                        .expect(200)
                        .end(function(err, res){
                            should.not.exist(err);
                            res.body.should.be.an.Array.and.have.length(3);
                            res.body[0].should.be.an.Object;
                            done();
                        });
                });
        });

        it('should be able to retrieve a list of logs for a 2 friends and hide usernames for non-friends', function(done){
            agent.post('/signin')
                .send({"username" : user3.username, "password" : user3.password})
                .expect(302)
                .expect('Location', '/')
                .end(function(err, res){
                    agent.get('/api/interactions/' + user.id + '/show/' + user2.id)
                        .expect(200)
                        .end(function(err, res){
                            should.not.exist(err);
                            res.body.should.be.an.Array.and.have.length(3);
                            //console.log("log.id: " + log.id);
                            var index = res.body.map(function(el) {
                                return el._id;
                            }).indexOf(log.id);
                            index.should.not.equal(-1);
                            res.body[index].instigator.should.be.an.Object.and.have.property('username','mystery');
                            res.body[index].target.should.be.an.Object.and.have.property('username',user.username);
                            done();
                        });
                });
        });


    });


    afterEach(function(done){
        request(app).get('/signout')
            .end(function(err, res) {
                should.not.exist(err);
                User.remove().exec(function () {
                    Interaction.remove().exec(function () {
                        done();
                    });
                });
            });

    });
});





var acceptFriendRequest = function(user, user2, cb){
    var route = '/api/pendingfriends/' + user2.id;
    agent.post('/signin')
        .send({"username": user.username, "password": user.password})
        .expect(302)
        .expect('Location','/')
        .end(function (err, res){
            if(err){console.log("Error signin: " + err);}
            User.findOne({_id : user2.id}).exec(function(err, user) {
                retrievedUser = user;
                agent.put(route)
                    .send(user)
                    .set('Accept','application/json')
                    .expect(200)
                    .end(function(err,res){
                        should.not.exist(err);
                        res.should.be.an.Object;
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


var requestFriendship = function(u1,u2,cb){
    User.findOne({_id : u2.id}).exec(function(err, user){

        // User.find({}, function(err, users) {
            should.not.exist(err);
        retrievedUser = user;
        retrievedUser.pendingFriends.push(u1.id);
        //    user.forEach(function(u){
        //        console.log(u);
        //    });
        //console.log("username: " + user2.username);
        //console.log("password: " + user2.password);
        var route = '/api/users/' + u2.id;
        agent.post('/signin')
            .send({"username" : u2.username, "password" : u2.password})
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
                        should.not.exist(err);
                        res.should.be.an.Object;
                        agent.get('/signout')
                            .end(function(err, res) {
                                if (err){"signout err: " + err}
                                should.not.exist(err);
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




var makeFriendship = function (userA, userB, cb){
    var f3 = function () {
            requestFriendship(userA, userB, function(){
                acceptFriendRequest(userA, userB, cb);
            });

    }();
};