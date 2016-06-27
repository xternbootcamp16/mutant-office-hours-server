// Create references for libraries
var express = require('express');
var http = require('http');
var firebase = require('firebase');
var dotenv = require('dotenv');
var twilio = require('twilio');
var mailgun = require('mailgun-js');

// Express server setup
var app = express();
var server = http.createServer(app);
dotenv.load();

// Authenticate Firebase
firebase.initializeApp({
  serviceAccount: "firebase-credentials-pm.json",
  databaseURL: "https://mutant-hours-pm.firebaseio.com"
});

// Get reference to firebase
var ref = firebase.database().ref();

// Authenticate mailgun and create mailgun client
var mailgunClient = mailgun({apiKey: process.env.MAILGUN_KEY, domain: process.env.MAILGUN_DOMAIN});

// Authenticate twilio and create twilio client
var twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

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

// Listen for new emails being added and send an email through mailgun
var emailsRef = ref.child('emails');
emailsRef.on('child_added', function(snapshot) {
  var email = snapshot.val();
  var emailData = {
    from: '<postmaster@' + process.env.MAILGUN_DOMAIN + '>',
    to: email.emailAddress,
    subject: 'Thanks for Registering!',
    text: 'Welcome to Mutant Office Hours.  Thanks for signing up! tis awesumm',
  };
  mailgunClient.messages().send(emailData, function(error, body) {
    console.log(body);
    if (error) {
      console.log(error);
    }
  });
});

server.listen(3030, function() {
  console.log('listening on http://localhost:3030');
});
