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
app.post('/register', function(req, res) {

		var userInput = req.body.user;
		var pwInput = req.body.password;
		console.log("username = " + userInput + ", password is " + pwInput);
		var newUser = new User({
			username: userInput,
			password: pwInput
			});

		newUser.save(function(err) {
			if (err) {
				console.log("Username: " + userInput + " already exists!");
				res.end("invalid");
			}

			else {
				console.log("Username: " + userInput + " accepted!");
				res.end("valid");
			}
		});
});

//implement password check
app.post('/login', function(req, res) {
	var userInput = req.body.user;
	var pwInput = req.body.password;
	var user;
	console.log("in login: username: " + userInput + ", password: " + pwInput);
	User.findOne({ username: userInput }, function(err, user) {
		if (err) {//check if query success
			//console.log("username: " + userInput + " doesn't exist!");
			console.log("Query to database failed!");
			res.end("BIGERROR");
			//res.end("DNE");
		}
		else { //if it exists, check the password
			if (user) {
				user.comparePassword(pwInput, function(err, isMatch) {
					if (err) { //if invalid pw
						console.log("Something went wrong with " + userInput + "'s request");
						res.end("BIGERROR");
					}
					else if (isMatch) {
						console.log("Password accepted for " + userInput);
						res.end("success");
					} 
					else if (!isMatch) {
						console.log("Incorrect password for " + userInput);
						res.end("wrongPW");
					}
				});
			}
			else {
				console.log("username: " + userInput + " doesn't exist!");
				res.end("DNE");
			}
		}
	});
});

/*
// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
// print a message when the server starts listening
console.log("server starting on " + appEnv.url + ", port number " + appEnv.port);
});
 */
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

