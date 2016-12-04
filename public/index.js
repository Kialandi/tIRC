
$(document).ready(function(){
  var user,pass;
  $("#login-submit").click(function(){
    user=$("#login-username").val();
    pass=$("#login-password").val();
    $.post("http://localhost:8080/login",{user: user,password: pass}, function(data){
      if(data === 'yes')
      {
        
        window.location.replace("http://localhost:8080/chat.html");
        //     alert("login successsadasd");
      }
    });
  });
});
