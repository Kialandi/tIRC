$(document).ready(function(){
  var user,pass;
  $("#submit").click(function(){
    user=$("#login-username").val();
    pass=$("#login-password").val();
    $.post("/login",{user: user,password: pass}, function(data){
      if(data==='done')
      {
        alert("login success");
      }
    });
  });
});
