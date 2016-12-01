var mongoose = require('mongoose');

exports.password = function password(username, callback) {
	var users = mongoose.model('users');
	users.find({
		'username': username
	}, function(err, users) {
		if(err) {
			console.log(err);
		} else {
			console.log(users);
			callback("", users);
		}
	});
{;
