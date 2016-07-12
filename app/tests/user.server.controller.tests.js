/**
 * Created by GB115151 on 08/05/2016.
 */
var app = require('../../server'),
    request = require('supertest'),
    should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    reqAgent = require('superagent');

agent = request.agent(app);
var user, user2;

describe('testing signing up a new account', function(){
    it('should create a new account and redirect to /',function(done){
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });
        agent.post('/signup')
            .send(user)
            .expect(302)
            .expect('Location','/')
            .end(function(err,res){
                should.not.exist(err);
                done();
            });
    });

    after(function(done) {
        User.remove().exec();
        request(app).get('/signout')
            .end(function(err, res) {
                if (err) console.log("logout error: " + err);
                done();
            });
    });
});

describe('testing login session', function() {
    beforeEach(function(done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });
        agent.post('/signup')
            .send(user)
            .end(function(err,res){
                if (err){console.log("signup error: " +err)}
                request(app).get('/signout')
                    .end(function(err, res) {
                        if (err) console.log("logout error: " + err);
                        done();
                    });
            });
    });

    it('Should login with the correct password', function(done) {
        agent.post('/signin')
            .send({ "username": "username", "password": "password" })
            .expect(302)
            .expect('Location','/')
            .end(function(err, res) {
                should.not.exist(err);
                done();
            });
    });

    //it('Should return the current session', function(done) {
    //    agent.get('/api/session').end(function(err, res) {
    //        expect(req.status).to.equal(200);
    //        done();
    //    });
    //});
    it('Should fail to login with incorrect password', function(done) {
        agent.post('/signin')
            .send({ "username": "username", "password": "wrong" })
            .expect('Location','/signin')
            .end(function(err, res) {
                should.not.exist(err);
                done();
            });
    });


    afterEach(function(done) {
        User.remove().exec();
        request(app).get('/signout')
            .end(function(err, res) {
                if (err) console.log("logout error: " + err);
                done();
            });
    });
});

describe("Testing setting up 2 new accounts and logging in", function(){
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
            password: 'password2'
        });
        done();
    });
        it('should create two new accounts sequentially',function(done){
            agent.post('/signup')
                .send(user)
                .expect(302)
                .expect('Location','/')
                .end(function(err,res){
                    should.not.exist(err);
                    agent.get('/signout')
                        .end(function(err, res) {
                            agent.post('/signup')
                                .send(user2)
                                .expect(302)
                                .expect('Location','/')
                                .end(function(err,res){
                                    should.not.exist(err);
                                    User.find().exec(function(err,users){
                                        done();
                                    });

                                });
                        });
                });
        });
    it('should be able to create 2 new account and sign into each of them',function(done){
        agent.post('/signup')
            .send(user2)
            .expect(302)
            .expect('Location','/')
            .end(function(err,res){
                should.not.exist(err);
                agent.get('/signout')
                    .end(function(err, res) {
                        agent.post('/signup')
                            .send(user)
                            .expect(302)
                            .expect('Location','/')
                            .end(function(err,res){
                                should.not.exist(err);
                                agent.post('/signin')
                                    .send({ "username": "username", "password": "password" })
                                    .expect(302)
                                    .expect('Location','/')
                                    .end(function(err, res) {
                                        should.not.exist(err);
                                        agent.post('/signin')
                                            .send({ "username": "username2", "password": "password2" })
                                            .expect(302)
                                            .expect('Location','/')
                                            .end(function(err, res) {
                                                should.not.exist(err);
                                                done();
                                            });
                                    });
                            });
                    });

            });
    });

    afterEach(function(done){
        User.remove().exec();
        request(app).get('/signout')
            .end(function(err, res) {
                if (err) console.log("logout error: " + err);
                done();
            });
    });

});