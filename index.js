// Create references for libraries
var express = require('express');
var http = require('http');
var firebase = require('firebase');
var dotenv = require('dotenv');
var twilio = require('twilio');

// Express server setup
var app = express();
var server = http.createServer(app);
dotenv.load();

// Authenticate Firebase
firebase.initializeApp({
  serviceAccount: "firebase-credentials.json",
  databaseURL: "https://mutant-hours-am.firebaseio.com"
});

// Authenticate twilio and create twilio client
var twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Get reference to firebase
var ref = firebase.database().ref();

// Listen for new texts being created on firebase
var textsRef = ref.child('texts');
textsRef.on('child_added', function(snapshot) {
  var text = snapshot.val();
  twilioClient.messages.create({
    body: text.name + ', I am available to see you now. Please come to my office so we can discuss: "' + text.topic + '"',
    to: text.phoneNumber,
    from: process.env.TWILIO_PHONE
  }, function(err, message) {
      if(err) {
        console.log(err.message);
      }
  });
});

server.listen(3030, function() {
  console.log('listening on http://localhost:3030');
});
