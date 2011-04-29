/* global dependencies */
var express = require('express'),
    util = require('util'),
    RedisStore = require('connect-redis'),
/* local dependencies */
    mongo = require(__dirname + '/../deps/mongodb/lib/mongodb'),
    io = require(__dirname + '/../deps/socketio/lib/socket.io'),
    OAuth = require(__dirname + '/../deps/oauth/lib/oauth').OAuth,
/* local modules */
    Config = require('./config').Config;

/**
 * OAuth gubbins
 */
var oa = new OAuth(Config.twitter.request_url,
    Config.twitter.access_url,
    Config.twitter.consumer_key,
    Config.twitter.consumer_secret,
    "1.0A",
    Config.twitter.callback_url,
    "HMAC-SHA1"
);

var app = express.createServer();

/**
 * Config stuff
 */
app.configure(function() {
    // let's use redis for our sessions
    app.use(express.cookieParser());
    app.use(express.session({secret: Config.session.secret, store: new RedisStore}));
    
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

app.get('/tweets', function(req, res) {
    res.header('Content-Type', 'application/json');
    var auth = getAuth(req);
    var msg = {};
    if (auth.isAuthed()) {
        util.debug('requesting user\'s timeline');
        oa.get("http://api.twitter.com/1/statuses/friends_timeline.json?count=64&include_rts=1", auth.getToken(), auth.getSecret(), function(err, data) {
            if (err) {
                msg = {
                    "success": false,
                    "message": err
                };
            } else {
               msg = {
                    "success": true,
                    "tweets": JSON.parse(data)
                };
            }
            res.send(msg);
        });
    } else {
        msg = {
            "success": false,
            "message": "Not Authed"
        }
        res.send(msg);
    }
});

app.get('/auth', function(req, res) {
    oa.getOAuthRequestToken(function(err, oauth_token, oauth_token_secret, results) {
        if (err) { 
            return res.send("Uh oh!");
        }
        req.session.oauth_token_secret = oauth_token_secret;
        util.debug("saving oauth token secret in session ["+req.session.oauth_token_secret+"]");
        res.redirect(Config.twitter.auth_url+"?oauth_token="+oauth_token);
    });
});

app.get('/authed', function(req, res) {
    req.session.oauth_verifier = req.oauth_verifier;
    util.log("using oauth token secret from session ["+req.session.oauth_token_secret+"]");
    util.log("using oauth token from URL param ["+req.query.oauth_token+"]");
    oa.getOAuthAccessToken(req.query.oauth_token, req.session.oauth_token_secret, function (err, oauth_access_token, oauth_access_token_secret, results) {
        if (err) {
            return res.send(err);
        }

        // done with session
        req.session.oauth_token_secret = null;

        // long live the cookies!
        util.debug("oauth_access_token ["+oauth_access_token+"] - oauth_access_token_secret ["+oauth_access_token_secret+"]");

        res.cookie('auth', JSON.stringify({"token":oauth_access_token, "secret":oauth_access_token_secret}));

        util.debug('written cookies');

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

function getAuth(req) {
    var auth = {
        token: null,
        secret: null
    };

    try {
        auth = JSON.parse(req.cookies.auth);
    } catch (e) {
        util.debug("couldn't parse auth cookie");
    }

    return {
        isAuthed: function() {
            return (auth.token != null && auth.secret != null);
        },

        getToken: function() {
            return auth.token;
        },

        getSecret: function() {
            return auth.secret;
        }
    }
}

app.listen(8124);
