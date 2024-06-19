var express=require("express");

var app=express();

app.listen(2999,function(){
    console.log("Server Started");
});

app.get("/hello",function(req,resp){
    resp.contentType("text/html");
        resp.write("Hello<br>");
        resp.write("WelcomeServer<br>");
        resp.write("Byee<br>");
        resp.end(); 
});

