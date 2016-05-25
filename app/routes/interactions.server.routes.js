/**
 * Created by GB115151 on 29/04/2016.
 */
var users = require('../../app/controllers/users.server.controller'),
    interactions = require('../../app/controllers/interactions.server.controller');
module.exports = function(app) {
    app.route('/api/interactions')
        .get(users.requiresLogin, interactions.list)
        .post(users.requiresLogin, interactions.create);
    app.route('/api/interactions/:interactionId')
    //    .get(interactions.read)
    //    .put(users.requiresLogin, interactions.hasAuthorization, interactions.update)
    //    .delete(users.requiresLogin, interactions.hasAuthorization, interactions.delete);
    //app.param('interactionId', interactions.interactionByID);
};