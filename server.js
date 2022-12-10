/*************************************************************************
* BTI325– Assignment 4
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
No part of this assignment has been copied manually or electronically from any other source.
* (including 3rd party web sites) or distributed to other students.
*
* Name: Raskirat Singh Kohli Student ID: 149660219 Date: 11/13/2022
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
    .then((data) => { if(data.length > 0){res.render("employees", {employees: data})}
    else{res.render("employees",{message: "no results"})};})
    .catch((err) => { res.render({message: "No Results"}) });
    return;
  }
  else if(req.query.department){
    var department = req.query.department;
    dataServ.getEmployeesByDepartment(department)
    .then((data) => { if(data.length > 0){res.render("employees", {employees: data})}
    else{res.render("employees",{message: "no results"})};})
    .catch((err) => { res.render({message: "No Results"}) });
    return;
  }
  else if(req.query.manager){
    var manager = req.query.manager;
    dataServ.getEmployeesByManager(manager)
    .then((data) => { if(data.length > 0){res.render("employees", {employees: data})}
    else{res.render("employees",{message: "no results"})};})
    .catch((err) => { res.render({message: "No Results"}) });
    return;
  }
  else{
    dataServ.getAllEmployees()
    .then((data) => { if(data.length > 0){res.render("employees", {employees: data})}
    else{res.render("employees",{message: "no results"})};})
    .catch((err) => {res.render("employees",{ message: "no results" }) });
    return;
  }
})
app.get("/employee/:empNum", (req, res) => {
  // initialize an empty object to store the values
  let viewData = {};
  dataService.getEmployeeByNum(req.params.empNum).then((data) => {
  if (data) {
  viewData.employee = data; //store employee data in the "viewData" object as "employee"
  } else {
  viewData.employee = null; // set employee to null if none were returned
  }
  }).catch(() => {
  viewData.employee = null; // set employee to null if there was an error
  }).then(dataService.getDepartments)
  .then((data) => {
  viewData.departments = data; // store department data in the "viewData" object as
 "departments"
  // loop through viewData.departments and once we have found the departmentId that matches
  // the employee's "department" value, add a "selected" property to the matching
  // viewData.departments object
  for (let i = 0; i < viewData.departments.length; i++) {
  if (viewData.departments[i].departmentId == viewData.employee.department) {
  viewData.departments[i].selected = true;
  }
  }
  }).catch(() => {
  viewData.departments = []; // set departments to empty if there was an error
  }).then(() => {
  if (viewData.employee == null) { // if no employee - return an error
  res.status(404).send("Employee Not Found");
  } else {
  res.render("employee", { viewData: viewData }); // render the "employee" view
  }
  });
 });
 
 app.get('/employees/add', (req, res) => {
  data.getDepartments()
    .then(function (data) {
      res.render('addEmployee', { departments: data });
    })
    .catch(() => res.render('addEmployee', { departments: [] }));
});
app.get('/employees/delete/:empNum', (req, res) => {
  data.deleteEmployeeByNum(req.params.empNum)
    .then(() => res.redirect('/employees'))
    .catch(() => res.status(500).send('delete employee error'));
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
  .then((data) => {if (data.length() > 0) res.render("departments",{departments: data})
else res.render("departments",{ message: "no results" })})
  .catch((err) => {res.json({message: err}) });
});
app.get("/departments/add", function(req,res){
  res.render('addDepartment');
});

app.post('/departments/add', (req, res) => {
  data.addDepartment(req.body)
    .then(() => res.redirect('/departments'))
    .catch((err) => res.json({ message: err }));
});

app.post('/departments/update', (req, res) => {
  data.updateDepartment(req.body)
    .then(res.redirect('/departments'))
    .catch((err) => res.json({ message: err }));
});

app.get('/department/:departmentId', (req, res) => {
  data.getDepartmentById(req.params.departmentId)
    .then((data) => {
      if (data.length > 0) {
        res.render('department', { department: data })
      }
      else {
        res.status(404).send("Department Not Found");
      }
    })
    .catch(() => {
      res.status(404).send("Department Not Found");
    });
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