$(document).ready(function(){
  var user, pass;
    
    $("#login-submit").click(function(){
    user=$("#login-username").val();
    pass=$("#login-password").val();
    $.post("http://localhost:8080/login",{user: user,password: pass}, function(data){
      
      if (data === 'success') {
        window.location.replace("http://localhost:8080/chat.html");
      } else if (data === 'DNE') {
		alert("We can't seem to find that user... Please TENACIOUSLY try again!");
      } else if (data === 'wrongPW') {
		alert("Bro, are you for real? Please TENACIOUSLY try to remember your password!");
      } else {
      		alert("This shouldn't have happened... We will TENACIOUSLY try to fix it!! Come back later and try again :)");
      }
    });
  });
  
  $("#register-submit").click(function(){
    user=$("#login-username").val();
    pass=$("#login-password").val();
    $.post("http://localhost:8080/login",{user: user,password: pass}, function(data){
      if (data === 'valid')
      {
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
      		alert("This shouldn't have happened... We will TENACIOUSLY try to fix it!! Come back later and try again :)");
      }
    });
  });
});

/*
$(document).ready(function(){
  var user,pass;
  $("#login-submit").click(function(){
    user=$("#login-username").val();
    pass=$("#login-password").val();
    $.post("http://localhost:8080/register",{user: user,password: pass}, function(data){
      console.log(data);
      if (data === 'success') {
        window.location.replace("http://localhost:8080/chat.html");
      } else if (data === 'DNE') {
		alert("We can't seem to find that user... Please TENACIOUSLY try again!");
      } else if (data === 'wrongPW') {
		alert("Bro, are you for real? Please TENACIOUSLY try to remember your password!");
      } else {
      		alert("This shouldn't have happened... We will TENACIOUSLY try to fix it!! Come back later and try again :)");
      }
    });
  });
});
*/
