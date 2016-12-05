var socket = io();

function log (message) {
	socket.emit('logs', message);
}

$('form').submit(function(){
  var sendStr = $('#m').val();
  socket.emit('new message', sendStr);//$('#m').val());
  $('#m').val('');//empties out the input bar
  return false;
});

socket.on('new message', function(data){
	if (!data.username) {
		$('#messages').append($('<li>').text(data.message));
	}
	else {
		var userAndMsg = data.username + ':  ' + data.message;
		$('#messages').append($('<li>').text(userAndMsg));
	}
});

socket.on('logs', function(data) {
	$('#messages').append($('<li>').text(data));//appends to the current entire chat
}

socket.on('user joined', function(data) {
	if (data)
		log('	' + data.username + ' has arrived');
	else ;
});
