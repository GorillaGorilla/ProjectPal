/**
 * Created by Frederick on 22/03/2016.
 */
var config = require('./config'),
    http = require('http'),
    socketio = require('socket.io'),
    session = require("express-session"),
    express = require("express"),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    MongoStore = require('connect-mongo')(session),
    flash = require('connect-flash'),
    methodOverride = require('method-override'),
    passport = require('passport'),
    transport = require("./transportsecurity")
    ;

module.exports = function(db) {
    var app = express();
    var server = http.createServer(app);
    var io = socketio.listen(server);

    function requireHTTPS(req, res, next) {
        if (req.headers && req.headers.$wssp === "80") {
            return res.redirect('https://' + req.get('host') + req.url);
        }
        next();
    };


    if (process.env.NODE_ENV === 'development'){
        app.use(morgan('dev'));
    }else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
        app.use(transport.httpsEnforce);
    }
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    var mongoStore = new MongoStore({
        db: db.connection.db
    });


    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        store: mongoStore
    }));

    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());


    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/users.server.routes.js')(app);
    require('../app/routes/friends.server.routes.js')(app);
    require('../app/routes/interactions.server.routes.js')(app);

    app.use(express.static('./public'));

    var port = (process.env.VCAP_APP_PORT || 'test-port');
    var host = (process.env.VCAP_APP_HOST || 'test-host');

    app.set('port', port);

    require('./socketio')(server, io, mongoStore);
    return server;
};