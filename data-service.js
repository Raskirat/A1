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
                if(managers.isManager == true){
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
exports.addEmployee = function(employeeData){
    if(employeeData.isManager == null)
        employeeData.isManager = false;
    else
        employeeData.isManager = true; 
        employeeData.employeeNum = employees.length + 1;
        employees.push(employeeData);
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            console.log("Get New Employee");
        },randomTime);
        resolve();
    });
}
exports.getEmployeesByStatus = function(status){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            console.log("Get Employees By Status");
            var temp;
            const manList = [];
            for(stat of employees){
                if(stat.status == status){
                    temp = stat;
                    
                    manList.push(temp);
                }
            }
            resolve(manList);
        },randomTime);
    });
}
exports.getEmployeesByDepartment = function(Department){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            console.log("Get Employees By Department");
            var temp;
            const manList = [];
            for(Dept of employees){
                if(Dept.department == Department){
                    temp = Dept;
                    manList.push(temp);
                }
            }
            resolve(manList);
        },randomTime);
    });
}
exports.getEmployeesByManager = function(manager){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            console.log("Get Employees By Manager");
            var temp;
            const manList = [];
            for(mng of employees){
                if(mng.employeeManagerNum == manager){
                    temp = mng;
                    manList.push(temp);
                }
            }
            resolve(manList);
        },randomTime);
    });
}
exports.getEmployeeByNum = function(num){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            console.log("Get Employees By Num");
            var temp;
            for(nm of employees){
                if(nm.employeeNum == num){
                    temp = nm;
                }
            }
            resolve(temp);
        },randomTime);
    });
}
