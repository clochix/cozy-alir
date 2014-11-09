//jshint node: true
var express    = require('express'),
    http       = require('http'),
    httpProxy  = require('http-proxy'),
    cors       = require('cors'),
    bodyParser = require('body-parser'),
    activity   = require('./lib/activity');
process.on('uncaughtException', function (err) {
  "use strict";
  console.error("Uncaught Exception");
  console.error(err);
  console.error(err.stack);
});

var app = express();
app.use(bodyParser.json());
var port = process.env.PORT || 9250;
var host = process.env.HOST || "127.0.0.1";

// Override default app configuration
app.get('/js/default.js', function (req, res) {
  "use strict";
  var config =
    'var defaultConfig = {\n' +
    '  corsproxy: window.location.protocol + "//" + window.location.host + "/apps/alir/proxy/",\n' +
    '  remoteActivity: true\n' +
    '};\n';
  res.setHeader('Content-Type', 'text/javascript');
  res.send(config);
});

// Serve static content
app.use(express.static(__dirname + '/node_modules/alir'));

// CORS proxy
(function () {
  "use strict";
  var proxy = httpProxy.createProxyServer();
  proxy.on('proxyReq', function(proxyReq, req, res, options) {
    proxyReq.path = 'http://' + req.params[0];
  });
  var proxyRequest = function (req, res) {
    proxy.web(req, res, { target: 'http://' + req.params[0] });
  };
  app.get('/proxy/*', cors(), proxyRequest);
}());

// Web Activities
(function () {
  "use strict";
  var handleActivity = function (req, res) {
    activity.handleActivity(req.body, res);
  };
  app.post('/activity', handleActivity);
  app.post('/apps/alir/activity', handleActivity);
}());

// Starts the server itself
http.createServer(app).listen(port, host, function() {
  "use strict";
  console.log("Server listening to %s:%d within %s environment", host, port, app.get('env'));
});

