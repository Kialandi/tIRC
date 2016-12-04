var socket = io();

var username = "Sam";

function log (message) {
	socket.emit('new message', message);
}

$('form').submit(function(){
  var sendStr = username + ":  " + $('#m').val();
  socket.emit('new message', sendStr);//$('#m').val());
  $('#m').val('');
  return false;
});

socket.on('new message', function(msg){
  $('#messages').append($('<li>').text(msg));
});

socket.on('user joined', function(data) {
	if (data)
		log(data.username + ' has arrived');
	else ;
});
