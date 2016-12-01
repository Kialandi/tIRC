var mongoose = require('mongoose');
var usernameSchema = new mongoose.Schema9{
	username: String,
	password: String
});

mongoose.mode('Username', usernameSchema);
mongoose.connect('mongodb://localhost/usernames');
