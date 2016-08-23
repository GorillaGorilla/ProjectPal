/**
 * Created by Frederick on 22/03/2016.
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('./config/mongoose'),
    express = require('./config/express'),
    passport = require('./config/passport'),
    cfenv = require('cfenv');

var db = mongoose();
var app = express(db);
var passport = passport();


var appEnv = cfenv.getAppEnv();

app.listen(appEnv.port);

module.exports = app;

console.log('Server running at port: ' + appEnv.port);