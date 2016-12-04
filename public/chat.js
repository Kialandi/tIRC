var socket = io();

var username = "Sam";

$('form').submit(function(){
  var sendStr = username + ":  " + $('#m').val();
  socket.emit('new message', sendStr);//$('#m').val());
  $('#m').val('');
  return false;
});

socket.on('new message', function(msg){
  $('#messages').append($('<li>').text(msg));
});
