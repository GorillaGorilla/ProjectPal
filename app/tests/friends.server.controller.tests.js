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
        console.log("beforeEach1 called");
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
            user2.pendingFriends.push(user.id);
            var route = '/api/users/' + user2.id;
            delete user2.password;
                agent.put(route)
                .send(user2)
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
        beforeEach(function(done) {
            User.findOne({_id : user2.id}).exec(function(err, user){
                retrievedUser = user;
                retrievedUser.pendingFriends.push(user.id);
                console.log("user2 retreived: " + retrievedUser);
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
                                done();
                            });
                    });
            });
            console.log("beforeEach2 called");

        });

        it('Should be able to accept a friend from the pending list', function(done){
            //User.findOne({_id: user2.id}).exec(function(err,user2){
            //    console.log("user2: " + user2);
            //    User.findOne({_id: user.id}).exec(function(err,userret){
            //        console.log("user: " + userret);
            //        done();
            //    });
            //});
            var route = '/api/friends/' + user.id;

            agent.post('/signin')
                .send({"username": user2.username, "password": user2.password})
                .expect(302)
                .expect('Location','/')
                .end(function (err, res){
                    if(err){console.log("Error signin: " + err);}
                    agent.put(route)
                        .send(user)
                        .set('Accept','application/json')
                        .expect(200)
                        .end(function(err,res){
                            should.not.exist(err);
                            User.findOne({_id: res.id}).populate('friends', 'username').exec(function(err, friend){
                                friend.friends.should.be.an.Array.and.have.lengthOf(1);
                                friend.friends[0].should.have.property('username', user.username);
                                //friend.pendingFriends.should.be.an.Array.and.have.lengthOf(0);
                                done();
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
        console.log("afterEach called");
        request(app).get('/signout')
            .end(function(err, res) {
                if (err) console.log("logout error: " + err);
                User.remove().exec();
                done();
            });
    });

});