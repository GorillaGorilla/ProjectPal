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
                                                done();
                                                //User.find().exec(function(err,doc){
                                                //    doc.should.be.an.Array.and.have.lengthOf(2);
                                                //    done();
                                                //});

                                            });
                                    });
                            });
                    });

            });
    });

    describe('Testing making a friend request', function() {
        it('Should be able to send a friend request', function(done){
            //console.log("user2 send: " + JSON.stringify(user2));
            var route = '/api/users/' + user2.id;
                agent.put(route)
                .send(user)
                .set('Accept','application/json')
                .expect(200)
                .end(function(err,res){
                    if (err){console.log("add friend err: " + err);}
                    //console.log("add friend res.body" + JSON.stringify(res.body));
                    should.not.exist(err);
                    res.body.should.be.an.Object.and.have.property('username', user2.username);
                    res.body.pendingFriends.should.be.an.Array.and.have.lengthOf(1);

                    User.findOne({_id: user2.id}).exec(function(err,user){
                        user.pendingFriends.should.be.an.Array.and.have.lengthOf(1);
                        done();
                    });


                });
        });
    });

    describe('Testing accepting a friend request', function(){
        beforeEach(function(done){
            agent.post('/api/friends/')
                .send(user2)
                .set('Accept','application/json')
                .end(function(err,res){
                    done();
                });
        });
        it('Should be able to accept a friend from the pending list', function(done){
            //User.find().exec(function(err,doc){
            //    doc.should.be.an.Array.and.have.lengthOf(2);  //works
            //    console.log("users: " + '\n' + doc);
            //    done();
            //});

            agent.get('/signout')
                .end(function(err, res){
                    if (err){console.log("error signing out");}
                    agent.post('/signin')
                        .send({"username": "username2", "password": "password"})
                        .expect(302)
                        .expect('Location','/')
                        .end(function (err, res){
                            if(err){console.log("Error signin: " + err);}

                            agent.put('/api/friends/')
                                .send(user)
                                .set('Accept','application/json')
                                .expect(200)
                                .end(function(err,res){
                                    should.not.exist(err);
                                    User.findOne({_id: res.id}).populate('friends', 'username').exec(function(err, friend){
                                        friend.friends.should.be.an.Array.and.have.lengthOf(1);
                                        friend.friends[0].should.have.property('username', user2.username);
                                        //friend.pendingFriends.should.be.an.Array.and.have.lengthOf(0);
                                        done();
                                    });
                                });
                        });
                });

        });
    });


    describe('Testing the GET methods', function() {

        //before(function(done){
        //    agent.post('/api/friends/')
        //        .send(user2)
        //        .set('Accept','application/json')
        //        .expect(200)
        //        .end(function(err,res){
        //            done();
        //        });
        //});

        //it('Should be able to get the list of friends', function(done){
        //    agent.get('/api/friends/')
        //        .set('Accept', 'application/json')
        //        .expect('Content-Type', /json/)
        //        .expect(200)
        //        .end(function(err, res) {
        //            res.body.should.be.an.Array();
        //            res.body[0].should.have.property('displayName', user2.displayName);
        //            done();
        //        });
        //});
        //it('Should be able to get the specific friend', function(done) {
        //    console.log('/api/friends/' + friend.id);
        //    request(app).get('/api/friends/' + friend.id)
        //        .set('Accept', 'application/json')
        //        .expect('Content-Type', /json/)
        //        .expect(200)
        //        .end(function(err, res) {
        //            res.body.should.be.an.Object.and.have.property('displayName', user2.displayName);
        //            done();
        //        });
        //});
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