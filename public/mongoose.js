//sets up mongo for database management

//var $ = require('jquery');

function sendToDB() {
  var mongoose = require('mongoose'),
  User = require('./model/schema/userSchema');//add more after this is you need more schemas

  mongoose.Promise = global.Promise;

  var connStr = "mongodb://tirc:tircpwpurdue@ds117348.mlab.com:17348/tircdb";

  var db = mongoose.connect(connStr, function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
  });

 // var userInput = "u2112ser";//accepts user input
 // var pwInput = "password";//accepts user input

var userInput = $('#login-username').text();
var pwInput = $('#login-password').text();

  //create user
  var newUser = new User({
    username: userInput,
    password: pwInput
  });

  newUser.save(function(err) {
    if (err) throw err;

    //fetch user
    User.findOne({ username: userInput }, function(err, user) {
      if(err) throw err;

      //check pw
      user.comparePassword(pwInput, function(err, isMatch) {
        if (err) throw err;
        console.log(pwInput, isMatch);//password is a match
        if (isMatch)
          return true;
        else return false;
      });

    });
  });
}

$(function() {
  $('#login-form-link').click(function(e) {
    e.preventDefault();
    sendToDB();
  });


  $('#register-form-link').click(function(e) {
    e.preventDefault();

  });

});

