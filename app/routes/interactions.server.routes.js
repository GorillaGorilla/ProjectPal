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
        .get(interactions.list);
    app.route('/api/interactions/:friendId/show')
        .get(interactions.listFriendLogs);
    app.route('/api/interactions/:friendId/show/:friend2Id')
        .get(interactions.listFriendLogs);
    app.route('api/interactions/score/')
        .get(interactions.getScore)
    app.route('api/interactions/score/:friendId/show')
        .get(interactions.getScore)

    app.param('interactionId', interactions.interactionByID);
    app.param('friendId', friends.friendWfriendsById);
    app.param('friend2Id', friends.friend2WfriendsById);
};