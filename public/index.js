$(document).ready(function(){
  var user, pass;
    
    $("#login-submit").click(function(){
    user=$("#login-username").val();
    pass=$("#login-password").val();
    $.post("http://localhost:8080/login",{user: user,password: pass}, function(data){
      if (data === 'success') {
        alert("Login successful! Welcome back to tIRC " + user + "!");
		window.location.replace("http://localhost:8080/chat.html");
      } else if (data === 'DNE') {
		alert("We can't seem to find that user... Please TENACIOUSLY try again!");
      } else if (data === 'wrongPW') {
		alert("Bro, are you for real? Please TENACIOUSLY try to remember your password!");
      } else {
      		alert("Login: This shouldn't have happened... We will TENACIOUSLY try to fix it!! Come back later and try again :)");
      }
    });
  });
  
  $("#register-submit").click(function(){
    user=$("#login-username").val();
    pass=$("#login-password").val();
    $.post("http://localhost:8080/register",{user: user,password: pass}, function(data){
      if (data === 'valid')
      {
	  	alert("Registration success! Welcome to tIRC " + user + "!");
        window.location.replace("http://localhost:8080/chat.html");
      } 
      else if (data === 'invalid') {
		alert("Username already taken! Please TENACIOUSLY try again!");
      } 
/*      else if (data === 'success') {
        window.location.replace("http://localhost:8080/chat.html");
      } 
      else if (data === 'DNE') {
		alert("We can't seem to find that user... Please TENACIOUSLY try again!");
      } 
      else if (data === 'wrongPW') {
		alert("Bro, are you for real? Please TENACIOUSLY try to remember your password!");
      }*/
      else {
      		alert("Register: This shouldn't have happened... We will TENACIOUSLY try to fix it!! Come back later and try again :)");
      }
    });
  });
});

