/**
 * Created by GB115151 on 16/05/2016.
 */

var app = require('../../server.js'),
    should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');
var user, user2;

describe('User Model Unit Tests:', function() {
    it('should be able to add a new user',function(done){
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });
        user.save(function(err) {
            should.not.exist(err);
            done();
        });
    });

    after(function(done){
        user.remove();
    });

});

describe('User Model Adding friends tests: ', function(){
    before(function(done){
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
        user.save(function(err) {
            done();
            user2.save(function(err){
                done();
            })
        });

    });
    it('should be able to add a friend to pending list', function(){
        user.pendingFriend.push(user2.__id);
        user.save(function(err){
            should.not.exist(err);
        });
    });

});