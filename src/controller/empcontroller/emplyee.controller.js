import Employees from '../../model/empmodel/Employees.js';
import redis from 'redis';

// Redis connection
const redisClient = redis.createClient(6379,'127.0.0.1');
redisClient.connect();
redisClient.on('connect', function(err){
    console.log('Connected Redis');
})

// CRUD Operation   

// create a new Employee
export const createEmployee = async(req, res, next) => {
    const newEmployee = await Employees(req.body);
    try {
        const saveEmployee = await newEmployee.save();
        res.status(200).send({
            message:'Employee successfully created',
            status: 200,
            result: saveEmployee
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            status: 500,
            result: error
        })
    }
};


// update a Employee    
export const updateEmployee = async(req, res, next) => {

    try {
        const updateEmployee = await Employees.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true}
        )
        res.status(200).send({
            message:'Employee successfully updated',
            status: 200,
            result: updateEmployee
        })

    } catch (error) {
        res.status(500).send({
            message: error.message,
            status: 500,
            result: error
        })
    }

};

// Get all Employees
export const getEmployees = async(req, res, next) => {
let keyName = 'employeesData';
let getCatchData = await redisClient.get(keyName);

if(getCatchData){
    console.log('GET CATCH DATA');
    const employeeData = await Employees.find();
    res.status(200).send({
        message:'Employees successfully retrieved GET DATA',
        status: 200,
        result: employeeData
    })
}else{
    console.log('SET CATCH DATA');
    const employeeData = await Employees.find();
    redisClient.set(keyName, JSON.stringify(employeeData),{EX:30});
    res.status(200).send({
        message:'Employees successfully retrieved Catch DATA',
        status: 200,
        result: employeeData
    })
}

};


// Get By id employee
export const getEmployeesById = async(req, res, next) => {
    let keyName ='EmployeesDataById';
    let getCatchData = await redisClient.get(keyName);

    if(getCatchData){
        console.log('GET  DATA');
        const employeeDataById = await Employees.findById(req.params.id);
        res.status(200).send({
            message:'Employees successfully retrieved GET DATA',
            status: 200,
            result: employeeDataById
        })
    }else{
        console.log('Get Data by Catching');
        const employeeDataById = await Employees.findById(req.params.id);
        redisClient.set(keyName, JSON.stringify(employeeDataById),{EX:30});
        res.status(200).send({
            message:'Employees successfully retrieved Catch DATA',
            status: 200,
            result: employeeDataById
        })
    }
};


// Delete a Employee
export const deleteEmployee = async(req, res, next) => {
    try {
        const deleteEmployee = await Employees.findByIdAndDelete(req.params.id);
        res.status(200).send({
            message:'Employee successfully deleted',
            status: 200,
            result: deleteEmployee
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            status: 500,
            result: error
        })
    }
}
