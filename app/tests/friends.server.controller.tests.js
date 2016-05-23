/**
 * Created by GB115151 on 16/05/2016.
 */
var app = require('../../server'),
    request = require('supertest'),
    should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');
var user, user2,
agent = request.agent(app);

describe('Friends Controller Unit Tests:', function() {
    beforeEach(function(done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });
        user2 = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name2',
            email: 'test2@test.com',
            username: 'username2',
            password: 'password'
        });

        agent.post('/signup')
            .send(user)
            .end(function (err, res) {
                if(err){console.log("Error first signup: " + err);}
                agent.post('/signup')
                    .send(user2)
                    .end(function(err, res){
                        if(err){console.log("Error second signup: " + err);}

                        agent.post('/signin')
                            .send({ "username": "username", "password": "password" })
                            .end(function (err, res){
                                if(err){console.log("Error signin: " + err);}
                                done();
                        });
                    });
            });
    });

    describe('Testing making a friend request', function() {
        it('Should be able to send a friend request', function(done){
            request(app).post('/api/friends')
                .send(user2)
                .set('Accept','application/json')
                .expect(200)
                .end(function(err,res){
                    if (err){console.log("add friend err: " + err);}
                    console.log("add friend res.body" + JSON.stringify(res.body));
                    should.not.exist(err);
                    res.body.should.be.an.Object.and.have.property('displayName', user2.displayName);
                    done();
                });
        });
    });

    describe('Testing the GET methods', function() {
        it('Should be able to get the list of friends', function(done){
            request(app).get('/api/friends/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    res.body.should.be.an.Array();
                    res.body[0].should.have.property('displayName', user2.displayName);
                    done();
                });
        });
        it('Should be able to get the specific friend', function(done) {
            console.log('/api/friends/' + friend.id);
            request(app).get('/api/friends/' + friend.id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    res.body.should.be.an.Object.and.have.property('displayName', user2.displayName);
                    done();
                });
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