/*************************************************************************
* BTI325– Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic
Policy. No part * of this assignment has been copied manually or electronically from any
other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Raskirat Singh Kohli Student ID: 149660219 Date: 10/7/2022
*
* Your app’s URL (from Cyclic) : https://ill-pink-python-belt.cyclic.app/
*
*************************************************************************/
var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
var dataServ = require("./data-service")
app.use(express.json());
app.use(express.urlencoded({extended: true}));
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
      res.json({images: items})
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
    res.sendFile(path.join(__dirname,"/views/home.html"));
  });
app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
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
    .then((data) => { res.json(data) })
    .catch((err) => { res.json({message: err}) });
    return;
  }
})
app.get("/employee/:value", function(req,res){
  var val = req.params.value;
  dataServ.getEmployeeByNum(val)
    .then((data) => { res.json(data) })
    .catch((err) => { res.json({message: err}) });
});
app.get("/employees/add", function(req,res){
  res.sendFile(path.join(__dirname,"/views/addEmployee.html"));
});
app.get("/images/add", function(req,res){
  res.sendFile(path.join(__dirname,"/views/addImage.html"));
});
app.get("/managers", function(req,res){
  dataServ.getManagers()
  .then((data) => { res.json(data) })
  .catch((err) => { res.json({message: err}) });
});
app.get("/departments", function(req,res){
  dataServ.getDepartments()
  .then((data) => { res.json(data) })
  .catch((err) => { res.json({message: err}) });
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