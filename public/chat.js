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
	var userAndMsg = data.username + ':  ' + data.message;
	$('#messages').append($('<li>').text(userAndMsg));
});

socket.on('user joined', function(data) {
	if (data) {
		var logStr = data.username + ' has arrived!';
		$('#messages').append($('<li>').text(logStr));
	}
	else ;
});
