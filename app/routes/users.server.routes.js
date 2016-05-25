/**
 * Created by Frederick on 23/03/2016.
 */
var users = require('../../app/controllers/users.server.controller'),
    passport = require('passport');
module.exports = function(app) {
    app.route('/users')
        .post(users.create)
        .get(users.list);
    app.route('/users/:userId')
        .get(users.read)
        .put(users.update)
        .delete(users.delete);

    app.route('/api/users')
        .get(users.list);
    app.route('/api/users/:userId')
        .get(users.read)
        .put(users.requiresLogin, users.update);

    //will need friends controller. Get will retrieve friend list of current user. Post will add a friend as pending.
    //put will be to accept friend request
    //app.route('/api/friends/)
    //    .get()
    //app.route('/api/friends/:friendId')
    app.route('/signup')
        .get(users.renderSignup)
        .post(users.signup);

    app.route('/signin')
        .get(users.renderSignin)
        .post(passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/signin',
            failureFlash: true
        }));

    app.get('/signout', users.signout);

    app.param('userId', users.userByID);
    //app.param('friendId', users.friendByID);
};