/**
 * Created by GB115151 on 09/05/2016.
 */
var friends = require('../../app/controllers/users.server.controller'),
users = require('../../app/controllers/users.server.controller');

module.exports = function(app) {
    app.route('/api/friends')
        .get(users.requiresLogin, friends.list)
        .post(users.requiresLogin, friends.add)
        .put(users.requiresLogin, friends.accept)
        .delete(users.requiresLogin, friends.decline);
    app.route('/api/friends/:friendsId')
        .get(users.requiresLogin, friends.read);
    //app.param('friendID', friend.friendByID);
};