/*************************************************************************
* BTI325– Assignment 4
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
No part of this assignment has been copied manually or electronically from any other source.
* (including 3rd party web sites) or distributed to other students.
*
* Name: Raskirat Singh Kohli Student ID: 149660219 Date: 10/7/2022
*
* Your app’s URL (from Cyclic Heroku) that I can click to see your application:
* https://shielded-wave-86299.herokuapp.com/
*
*************************************************************************/
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
var dataServ = require("./data-service")
const exphbs = require("express-handlebars");
app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: 'main', helpers: {
  navLink: function(url, options){
  return '<li' + ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
  '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
 },
 equal: function (lvalue, rvalue, options) {
  if (arguments.length < 3)
  throw new Error("Handlebars Helper equal needs 2 parameters");
  if (lvalue != rvalue) {
  return options.inverse(this);
  } else {
  return options.fn(this);
  }
 } } }));
app.set('view engine', '.hbs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(function(req,res,next){
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
 });
 
//img stuff
var multer = require("multer");
const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect("/images");
});
const fs = require('node:fs');
app.get("/images", function(req,res){
  fs.readdir("./public/images/uploaded", (err, items) => {
    if(err)
      console.log(err);
    else{
      res.render("images", {images: items, layout: false});
    }
  });
});
//server stuff
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }
app.use(express.static('public')); 
// setup a 'route' to listen on the default url path
app.get("/", function(req,res){
  res.render('home');  
});
app.get("/about", function(req,res){
  res.render('about');  
  });
app.get("/employees", function(req,res){
  if(req.query.status){
    var stat = req.query.status;
    dataServ.getEmployeesByStatus(stat)
    .then((data) => { res.json(data) })
    .catch((err) => { res.json({message: err}) });
    return;
  }
  if(req.query.department){
    var department = req.query.department;
    dataServ.getEmployeesByDepartment(department)
    .then((data) => { res.json(data) })
    .catch((err) => { res.json({message: err}) });
    return;
  }
  if(req.query.manager){
    var manager = req.query.manager;
    dataServ.getEmployeesByManager(manager)
    .then((data) => { res.json(data) })
    .catch((err) => { res.json({message: err}) });
    return;
  }
  else{
    dataServ.getAllEmployees()
    .then((data) => {res.render("employees",{employees: data})})
    .catch((err) => { res.render({message: "No Results"}) });
    return;
  }
})
app.get("/employee/:value", function(req,res){
  var val = req.params.value;
  dataServ.getEmployeeByNum(val)
    .then((data) => { res.render("employee", { employee: data }); })
    .catch((err) => {  res.render("employee",{message:"no results"}); });
});
app.get("/employees/add", function(req,res){
  res.render('addEmployee');  
});
app.post("/employee/update", (req, res) => {
  dataServ.updateEmployee(req.body)
    .then(() => { res.redirect("/employees"); })
    .catch((err) => { res.json({message: err}) });
 });
app.get("/images/add", function(req,res){
  res.render('addImage');  
});
app.get("/managers", function(req,res){
  dataServ.getManagers()
  .then((data) => { res.json(data) })
  .catch((err) => { res.json({message: err}) });
});
app.get("/departments", function(req,res){
  dataServ.getDepartments()
  .then((data) => {res.render("departments",{departments: data})})
  .catch((err) => { res.render({message: "No Results"}) });
});
//Middleware Stuff
app.post("/employees/add", function(req,res){
  dataServ.addEmployee(req.body)
  .then(() => { res.redirect("/employees") })
  .catch((err) => { res.json({message: err}) });
});

app.get("*", function(req,res){
  res.send("Uh Oh! Error 404: File Not Found");
});
// setup http server to listen on HTTP_PORT
dataServ.initialize()
.then(() => {app.listen(HTTP_PORT, onHttpStart)})
.catch(function(reason){
  console.log(reason);
});