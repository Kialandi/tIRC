/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

//require('mongoose')();
// create a new express server
var app = express();
var bodyParser = require("body-parser");
var http = require('http').Server(app);

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

//creates the server
//var io = require('http').createServer(app);

var io = require('socket.io')(http);

var mongoose = require('mongoose'),
    User = require('./model/schema/userSchema');//add more after this is you need more schemas
mongoose.Promise = global.Promise;
var connStr = "mongodb://tirc:tircpwpurdue@ds117348.mlab.com:17348/tircdb";
var db = mongoose.connect(connStr, function(err) {
  if (err) throw err;
  console.log('Successfully connected to MongoDB');
});

var isMatch;

//implement compare password
app.post('/login', function(req, res) {

  var userInput = req.body.user;
  var pwInput = req.body.password;
  console.log("username = " + userInput + ", password is " + pwInput);
  //var success = sendToDB(user_name, password);

  var newUser = new User({
    username: userInput,
    password: pwInput
  });

  newUser.save(function(err) {
    if (err) throw err;

    //fetch user
    User.findOne({ username: userInput }, function(err, user) {
      if (err) throw err;

      //check pw
      /*      user.comparePassword(pwInput, function(err, isMatch) {
              if (err) throw err;

              console.log(pwInput, isMatch);//password is a match

      //if (isMatch)
      //	return true;
      //else return false;
      });
      });*/
  });


  /*  if (isMatch) {
      res.end("yes");//login success proceed to chat
      res.sendfile('chat.html');
      } else {
      res.end("no");//login failed, credentials invalid or user does not exist
      res.sendfile('index.html');
      }*/
  });
  res.end("yes");
});

//implement adding to db
app.post('/register', function(req, res) {
  var userInput = req.body.user;
  var pwInput = req.body.password;

  console.log("username = " + userInput + ", password is " + pwInput);
  User.findOne({ username: userInput }, function(err, user) {
    if (err) throw err;

    //check pw
    user.comparePassword(pwInput, function(err, isMatch) {
      if (err) throw err;

      console.log(pwInput, isMatch);//password is a match

      if (isMatch) {
        res.end("yes");//register success, proceed to chat
        res.sendfile('chat.html');
      } else {
        res.end("no");//register failed, user already exists
        res.sendfile('index.html');
      }
    });
  });
});

// start server on the specified port and binding host
//app.listen(appEnv.port, '0.0.0.0', function() {
// print a message when the server starts listening
//  console.log("server starting on " + appEnv.url + ", port number " + appEnv.port);
//});

var numUsers = 0;

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

io.emit('some event', { for: 'everyone' });

io.on('connection', function(socket) {
  console.log('a user connected');
  var addedUser = false;

  //    socket.on('chat message', function(msg) {
  //    io.emit('chat message', msg);
  //});

  socket.on('new message', function(data) {
    io.emit('new message', data);//{
    //			username: socket.username,
    //			message: data
    //		});
  });

socket.on('add user', function(username) {
  if(addedUser)
    return;

  socket.username = username;
  numUsers++;
  addedUser = true;
  socket.emit('login', {
    numUsers: numUsers
  });

  socket.broadcast.emit('user joined', {
    username: socket.username,
    numUser: numUsers
  });
});

socket.on('typing', function() {
  socket.broadcast.emit('typing', {
    username: socket.username
  });
});

socket.on('stop typing', function() {
  socket.broadcast.emit('stop typing', {
    username: socket.username
  });
});

socket.on('disconnect', function() {
  if (addedUser) {
    --numUsers;

    socket.broadcast.emit('user left', {
      username: socket.username,
      numUsers: numUsers
    });
  }
});
});

http.listen(8080, function() {
  console.log('listening on *:' + 8080);
});

