var express = require('express');
var dateTime = require('node-datetime');
var RtmClient = require('@slack/client').RtmClient;

// Express server configuration
var app = express();

app.set('trust proxy');
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 3000));
app.use(express.static('public'));

// Slack configuration
var token = process.env.SLACK_BOT_TOKEN || '';
var channel = 'C6EGUFEEA';
var rtm = new RtmClient(token);

// Date/time configuration
var dt = dateTime.create()

app.use(function(req, res, next) {
    var method = req.method;
    var url = req.url
    var ip = req.headers['x-forwarded-for'];
    var time = new Date(dt.getTime());

    var message = ip + ' - ' + time + ' - ' + method + ' ' + url;
    rtm.sendMessage(message, channel, function(err) {
        if (err) console.log(err);
    });

    next();
});

app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get('/about', function(req, res) {
    res.render('pages/about', {title: 'about'});
});

app.get('/show', function(req, res) {
    res.render('pages/show');
});

app.get('/afterparty', function(req, res) {
    res.render('pages/afterparty');
});

app.get('/getinvolved', function(req, res) {
    res.render('pages/getinvolved');
});

app.get('/sponsors', function(req, res) {
    res.render('pages/sponsors');
});

app.listen(app.get('port'), function() {
    console.log('Server started on 127.0.0.1');
    try {
        console.log('Slack client started');
        rtm.start();
    } catch (e) {
        console.log('ERROR: Slack client failed to start');
    }
});
