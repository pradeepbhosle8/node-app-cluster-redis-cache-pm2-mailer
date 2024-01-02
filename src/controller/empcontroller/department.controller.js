import Department from '../../model/empmodel/Deparment.js';
import  redis from 'redis';

const redisClient = redis.createClient(6379,'127.0.0.1');
redisClient.connect();
redisClient.on('connect', function(err){
    console.log('Connected Redis');
})

// CRUD operations


// Create a new Deparment
export const createDepartment = async (req, res, next) => {
    const newDeparment = new Department(req.body);
    try {
        const saveDepartment = await newDeparment.save();
        res.status(200).send({
            message: 'Department Save Successfully',
            status:200,
            result:saveDepartment
        }) 
    } catch (error) {
        res.status(500).send({
            message: error.message,
            status:500,
            result:error
        })
    } 
}

// update Deparment
export const updateDepartment = async (req, res, next) =>{
try {
    const updateDepartment =await Department.findByIdAndUpdate(
        req.params.id,
        {$set: req.body},
        {new: true}
    )
    res.status(200).send({
        message: 'Department Update Successfully',
        status  : 200,
        result: updateDepartment
    })
} catch (error) {
    res.status(500).send({
        message : error.message,
        status:500,
        result:error
    })
}
}

// get All Deparments
export const getAllDeparments = async (req, res, next) => {
    let keyName = 'departmentData';
    let getCatchData = await redisClient.get(keyName);

    if(getCatchData){
        console.log('GET CATCH DATA');
        const departmentData = await Department.find();
        res.status(200).send({
            message:'Department Data Successfully Retrieved GET Data',
            status: 200,
            result:departmentData
        })
    }else{
        console.log('set Catch data');
        const departmentData = await Department.find();
        redisClient.set(keyName, JSON.stringify(departmentData),{EX:30});
        res.status(200).send({
            message:'Department Data Successfully retrieved Catch Data',
            status: 200,
            result:departmentData
        })
    }
}

// Get by id Deparment
export const getById = async (req, res, next) => {
    let keyNamedepartmentID = 'departmentDataId';
    let getCatchData = await redisClient.get(keyNamedepartmentID);

    if(getCatchData){
        console.log('Get Catch Data Successfully retrieved ');
        const DeparmentId = await Department.findById(req.params.id);
        res.status(200).send({
            message:'DeparmentBy ID Data Successfully retrieved GET Data',
            status: 200,
            result:DeparmentId
        })
    }else{
        console.log('SET Catch Data');
        const departmentId = await Department.findById(req.params.id);
        redisClient.set(keyNamedepartmentID, JSON.stringify(departmentId),{EX:30});
        res.status(200).send({
            message:'DeparmentBy ID Data Successfully retrieved SET Catch Data',
            status: 200,
            result:departmentId
        })
    }
}


// Delete a Deparment
export const deleteDeparment = async (req, res,next) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);
        res.status(200).send({
            message:'DeparmentBy ID Data Successfully Delete',
            status: 200,
            result:department
        })
    } catch (error) {
        res.status(500).send({
            message:error.message,
            status: 500,
            result:error.message
        })
    }
}
