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

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var io = require('http').createServer(app);

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url + ", port number " + appEnv.port);
});

var numUsers = 0;

io.on('connection', function(socket) {
	var addedUser = false;

	socket.on('new message', function(data) {
		socket.broadcast.emit('new message', {
			username: socket.username,
			message: data
		});
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
