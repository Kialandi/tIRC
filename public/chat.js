var socket = io();
/*
function log (msg) {
	socket.emit('new message', {
		message: msg,
		logFlag: 'yes'
	});
}
*/
$('form').submit(function(){
  var sendStr = $('#m').val();
  socket.emit('new message', sendStr);//$('#m').val());
  $('#m').val('');//empties out the input bar
  return false;
});

socket.on('new message', function(data){
	if (data.username) {
		var userAndMsg = data.username + ':  ' + data.message;
		$('#messages').append($('<li>').text(userAndMsg));
	}
	else ;//do nothing if the person connected isn't logged in
});

socket.on('user joined', function(data) {
	if (data.username) {
		var logStr = '----------------------     ' + data.username + ' has arrived!     ---------------------';
		$('#messages').append($('<li>').text(logStr));
	}
	else ;
});

socket.on('user left', function(data) {
	if (data.username) {
		var logStr = '---------------------     ' + data.username + ' has left!     ---------------------';
		$('#messages').append($('<li>').text(logStr));
	}
	else ;
});

socket.on('please login', function(data) {
	alert(data.message);
	window.location.replace('/index.html');
});
