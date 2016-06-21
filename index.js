// Create references for libraries
var express = require('express');
var http = require('http');
var firebase = require('firebase');
var dotenv = require('dotenv');

// Express server setup
var app = express();
var server = http.createServer(app);
dotenv.load();

// Authenticate Firebase
firebase.initializeApp({
  serviceAccount: "firebase-credentials.json",
  databaseURL: "https://mutant-hours-am.firebaseio.com"
});

// Get reference to firebase
var ref = firebase.database().ref();

// Listen for new texts being created on firebase
var textsRef = ref.child('texts');
textsRef.on('child_added', function(snapshot) {
  console.log(snapshot.val());
});

server.listen(3030, function() {
  console.log('listening on http://localhost:3030');
});
