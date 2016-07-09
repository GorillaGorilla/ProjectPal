/**
 * Created by GB115151 on 16/05/2016.
 */

var app = require('../../server.js'),
    should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');
var user, user2, user3, retrievedUser;

describe('User Model Unit Tests:', function() {

    it('should be able to add a new user',function(done){
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password',
            provider: 'local'
        });
        user.save(function(err) {
            if (err){console.log("save error; " + err)};
            should.not.exist(err);
            done();
        });
    });

    describe('User Model Adding friends tests: ', function(){
        beforeEach(function(done){
            user = new User({
                firstName: 'Full',
                lastName: 'Name',
                displayName: 'Full Name',
                email: 'test@test.com',
                username: 'username',
                password: 'password',
                provider: 'local'
            });
            user2 = new User({
                firstName: 'Full',
                lastName: 'Name',
                displayName: 'Full Name2',
                email: 'test2@test.com',
                username: 'username2',
                password: 'password',
                provider: 'local'
            });
            user3= new User({
                firstName: 'Full',
                lastName: 'Name',
                displayName: 'Full Name3',
                email: 'test3@test.com',
                username: 'username3',
                password: 'password',
                provider: 'local'
            });
            user.save(function(err) {
                if (err){console.log("user1 save err: " + err)};
                user2.save(function(err){
                    if (err){console.log("user2 save err: " + err)};
                    user3.save(function(err){
                        if (err){console.log("user3 save err: " + err)};
                        done();
                    });

                })
            });

        });
        it('should be able to add a friend to pending list', function(done){
            user.pendingFriends.push(user2._id);
            user.save(function(err){
                should.not.exist(err);
                User.findOne({username: 'username'}, function(err, user){
                    should.not.exist(err);
                    //console.log("user: " + JSON.stringify(user));
                    user.should.be.an.Object.and.have.property('username','username');
                    user.pendingFriends.should.be.an.Array.and.have.lengthOf(1);
                    done();
                })
            });


        });
        it('should be able to add 2 friends to pending list', function(done){
            user.pendingFriends.push(user2._id);
            user.pendingFriends.push(user3._id);
            user.save(function(err){
                should.not.exist(err);
                User.findOne({username: 'username'}, function(err, user){
                    should.not.exist(err);
                    //console.log("user: " + JSON.stringify(user));
                    user.should.be.an.Object.and.have.property('username','username');
                    user.pendingFriends.should.be.an.Array.and.have.lengthOf(2);
                    done();
                })
            });
        });
    });



    afterEach(function(done){
        User.remove().exec();
        done();
    });

});

