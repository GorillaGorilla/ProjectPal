/**
 * Created by Frederick on 22/03/2016.
 */
module.exports = function(app){
    var index = require('../controllers/index.server.controller');
    app.get('/', index.render);
};