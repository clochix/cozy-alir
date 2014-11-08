//jshint node: true
var express = require('express'),
    http    = require('http');

var app = express();
app.use(express.static(__dirname + '/node_modules/alir'));

var port = process.env.PORT || 9250;
var host = process.env.HOST || "127.0.0.1";

// Starts the server itself
var server = http.createServer(app).listen(port, host, function() {
  "use strict";
  console.log("Server listening to %s:%d within %s environment",
              host, port, app.get('env'));
});

