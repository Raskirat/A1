var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
//var dataServ = require("data-service")
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }
app.use(express.static('public')); 
// setup a 'route' to listen on the default url path
app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/home.html"));
  });
app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
  });
// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);