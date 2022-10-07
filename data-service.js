var employees;
var departments;
var randomTime = Math.floor(Math.random() * 3000) + 1;
exports.initialize = function(){
    const fs = require('node:fs');
    fs.readFile('./data/employees.json',(err,data)=>{
        if (err) reject("Failure to read file employees.json!");
        employees = JSON.parse(data);
    });
    fs.readFile('./data/departments.json',(err,data)=>{
        if (err) reject("Failure to read file departments.json!");
        departments = JSON.parse(data);
    });
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            console.log("Initialize");
            resolve("Data succesfully initialized!");
        },randomTime);
    });
}
exports.getAllEmployees = function(){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            console.log("Get All Employees");
            resolve(employees);
        },randomTime);
    });
}
exports.getManagers = function(){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            console.log("Get All Managers");
            var temp;
            const manList = [];
            for(managers of employees){
                if(managers.isManager = true){
                    temp = managers;
                    manList.push(temp);
                }
            }
            resolve(manList);
        },randomTime);
    });
}
exports.getDepartments = function(){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            console.log("Get All Departments");
            resolve(departments);
        },randomTime);
    });
}

