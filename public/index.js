$(document).ready(function(){
  var user,pass;
  $("#login-submit").click(function(){
    user=$("#login-username").val();
    pass=$("#login-password").val();
    $.post("http://localhost:8080/login",{user: user,password: pass}, function(data){
      if(data==='done')
      {
        alert("login success");
      }
    });
  });
});
