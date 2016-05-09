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
var user;

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

                done();
            });
        //user.save(function () {
        //    done();
        //})
    });


    it('Should create a session', function(done) {


        agent.post('/signin')
            .send({ "username": "username", "password": "password" })
            .expect(302)
            .expect('Location','/')
            .end(function(err, res) {
                should.not.exist(err);
                //res.header['location'].should.include('/');
                //res.should.have.property('status',200);
                //if (err){console.log("res error: " + err)}
                //console.log("res: " + res);
                done();
            });


    });

    //it('Should return the current session', function(done) {
    //    agent.get('/api/session').end(function(err, res) {
    //        expect(req.status).to.equal(200);
    //        done();
    //    });
    //});

    afterEach(function(done) {
        User.remove().exec();
        request(app).get('/signout')
            .end(function(err, res) {
                if (err) console.log("logout error: " + err);
                done();
            });
    });
});