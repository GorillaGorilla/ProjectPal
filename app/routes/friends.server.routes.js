/**
 * Created by GB115151 on 09/05/2016.
 */
var friends = require('../../app/controllers/friends.server.controller'),
users = require('../../app/controllers/users.server.controller');

module.exports = function(app) {
    app.route('/api/friends')
        .get(users.requiresLogin, friends.list)
        .post(users.requiresLogin, friends.add)
        .put(users.requiresLogin, friends.accept)
        .delete(users.requiresLogin, friends.decline);
    app.route('/api/friends/:friendId')
        .get(users.requiresLogin, friends.read)
        .put(users.requiresLogin, friends.accept);

    app.route('/api/pendingfriends')
        .get(users.requiresLogin, friends.listpending)
        .put(users.requiresLogin, friends.accept)
        .delete(users.requiresLogin, friends.decline);
    app.route('/api/pendingfriends/:friendId')
        .put(users.requiresLogin, friends.accept);
    app.param('friendId', friends.friendById);
};