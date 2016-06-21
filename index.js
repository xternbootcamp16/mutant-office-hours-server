// Create references for libraries
var express = require('express');
var http = require('http');
var firebase = require('firebase');

// Express server setup
var app = express();
var server = http.createServer(app);

// Authenticate Firebase
firebase.initializeApp({
  serviceAccount: "firebase-credentials.json",
  databaseURL: "https://mutant-hours-am.firebaseio.com"
});

server.listen(3030, function() {
  console.log('listening on http://localhost:3030');
});
