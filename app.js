'use strict';

const http = require('http');
const url = require('url');
const express = require('express');
const app = express();
const config = require('./config');
const path = require('path');
const genToken = require('./lib/genToken');

app.use(express.static(path.join(__dirname, 'public')));
// app.get('/', function(req, res) {

// });

app.get('/token', function(req, res) {
  res.writeHead(200, {
    'Content-Type':'text/json',
    'Expires': 0,
    'Pragma': 'no-cache'
  });
  var retJson = {
    uptoken: genToken()
  }
  res.end(JSON.stringify(retJson));
});

http.createServer(app).listen(config.port, function() {
  console.log('server run at: ', config.port);
});
