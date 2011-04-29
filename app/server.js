/* global dependencies */
var express = require('express'),
    util = require('util'),
    RedisStore = require('connect-redis'),
/* local dependencies */
    mongo = require(__dirname + '/../deps/mongodb/lib/mongodb'),
    io = require(__dirname + '/../deps/socket.io/lib/socket.io'),
    OAuth = require(__dirname + '/../deps/oauth/lib/oauth').OAuth,
/* local modules */
    Config = require('./config').Config;

/**
 * OAuth gubbins
 */
var oa = new OAuth(config.twitter.request_url,
    config.twitter.access_url,
    config.twitter.consumer_key,
    config.twitter.consumer_secret,
    "1.0A",
    config.twitter.callback_url,
    "HMAC-SHA1"
);

var app = express.createServer();

/**
 * config stuff
 */
app.configure(function() {
    // let's use redis for our sessions
    app.use(express.cookieParser());
    app.use(express.session({secret: config.session.secret, store: new RedisStore}));
    
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.static(__dirname + '/../public'));

    app.set('view engine', 'ejs');
});

app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/', function(req, res) {
    res.render('index', {});
});

app.get('/auth', function(req, res) {
    oa.getOAuthRequestToken(function(err, oauth_token, oauth_token_secret, results) {
        if (err) { 
            return res.send("Uh oh!");
        }
        req.session.oauth_token = oauth_token;
        req.session.oauth_token_secret = oauth_token_secret;
        util.log("saving oauth token in session ["+req.session.oauth_token+"]");
        res.redirect(config.twitter.auth_url+"?oauth_token="+oauth_token);
    });
});

app.get('/authed', authState('any'), function(req, res) {
    req.session.oauth_verifier = req.oauth_verifier;
    util.log("using oauth token from session ["+req.session.oauth_token+"]");
    oa.getOAuthAccessToken(req.session.oauth_token, req.session.oauth_token_secret, function (err, oauth_access_token, oauth_access_token_secret, results) {
        if (err) {
            return res.send(err);
        }

        // done with session
        req.session.oauth_token = null;
        req.session.oauth_token_secret = null;

        // long live the cookies!
        res.cookie('oauth_access_token', oauth_access_token);
        res.cookie('oauth_access_token_secret', oauth_access_token_secret);
        res.redirect('/');
    });
});
/**
 * pre-route auth checks
 */
function authState(authed) {
    return function(req, res, next) {
        req._user = new User();
        if (typeof req.session.user === 'object') {
            req._user.setProperties(req.session.user);
            req._user.setAuthed(true);
        }
        if (authed === 'any') {
            next();
        } else {
            if (req._user.isAuthed() !== authed) {
                next(new Error('Incorrect auth state ['+req._user.isAuthed().toString()+']'));
            } else {
                next();
            }
        }
    }
}
