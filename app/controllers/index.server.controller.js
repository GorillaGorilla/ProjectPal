/**
 * Created by Frederick on 22/03/2016.
 */
exports.render = function(req, res){
    res.render('index', {
        title: 'Hello World',
        user: JSON.stringify(req.user)
    });
};