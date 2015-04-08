//jshint node: true
var connect     = require('connect'),
    http        = require('http'),
    httpProxy   = require('http-proxy'),
    cors        = require('cors'),
    bodyParser  = require('body-parser'),
    path        = require('path'),
    serveStatic = require('serve-static'),
    fs          = require('fs'),
    app, port, host, server;
process.on('uncaughtException', function (err) {
  "use strict";
  console.error("Uncaught Exception");
  console.error(err);
  console.error(err.stack);
});

app = connect();
app.use(bodyParser.json());
port = process.env.PORT || 9252;
host = process.env.HOST || "127.0.0.1";

// Override default app configuration
app.use('/js/default.js', function (req, res) {
  "use strict";
  res.setHeader('Content-Type', 'text/javascript');
  fs.createReadStream(path.join(__dirname, '/public/public.js')).pipe(res);
});

// CORS proxy
(function () {
  "use strict";
  var proxy, proxyRequest;
  proxy = httpProxy.createProxyServer();
  proxy.on('proxyReq', function (proxyReq, req, res, options) {
    proxyReq.path = 'http://' + req.url.substr(1);
  });
  proxyRequest = function (req, res) {
    proxy.web(req, res, { target: 'http://' + req.url.substr(1) });
  };
  app.use('/proxy/', cors());
  app.use('/proxy/', proxyRequest);
}());

// Serve static content
app.use(serveStatic(path.join(__dirname, '/node_modules/alir')));

// Starts the server itself
server = http.createServer(app).listen(port, host, function () {
  "use strict";
  console.log("Server listening to %s:%d", host, port);
});

