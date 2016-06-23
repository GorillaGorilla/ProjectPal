/**
 * Created by GB115151 on 29/04/2016.
 */
var users = require('../../app/controllers/users.server.controller'),
    interactions = require('../../app/controllers/interactions.server.controller'),
    friends = require('../../app/controllers/friends.server.controller');
module.exports = function(app) {
    app.route('/api/interactions')
        .get(users.requiresLogin, interactions.list)
        .post(users.requiresLogin, interactions.create);
    app.route('/api/interactions/:interactionId');
        //.get(interactions.read);
    //    .put(users.requiresLogin, interactions.hasAuthorization, interactions.update)
    //    .delete(users.requiresLogin, interactions.hasAuthorization, interactions.delete);
    app.route('/api/interactions/:friendId')
        .get(users.requiresLogin,interactions.list);
    app.route('/api/interactions/:friendId/show')
        .get(users.requiresLogin,interactions.listFriendLogs);
    app.route('/api/interactions/:friendId/show/:friend2Id')
        .get(users.requiresLogin,interactions.listFriendLogs);
    app.route('/api/interactions/score/stats')
        .get(users.requiresLogin,interactions.getScore);
    app.route('/api/interactions/score/stats/:friendId/')//doesn't work??? 14/06/2016 fixed, leading '/' is important!!!
        .get(users.requiresLogin,interactions.getScore);
    app.route('/api/interactions/score/stats/:friendId/:friend2Id')//doesn't work??? 14/06/2016 fixed, leading '/' is important!!!
        .get(users.requiresLogin,interactions.getScore);

    app.param('interactionId', interactions.interactionByID);
    app.param('friendId', friends.friendWfriendsById);
    app.param('friend2Id', friends.friend2WfriendsById);
};