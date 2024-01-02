import users from '../model/user.model.js';


//####### Redis ###########//
import redis from 'redis';
//####### axios and node-fetch ###########//
import axios from 'axios';
import fetch from 'node-fetch';


const redisClient = redis.createClient(6379,'127.0.0.1');
// connrection cehck redis connection
redisClient.connect();
redisClient.on('Connect', function(err){
    console.log('Connected Redis')
})


// All user fetch Method 
export const getUsers = async (req, res, next)=>{
    try {

        let keyName = 'userDate';

        let getCacheData = await redisClient.get(keyName);
      
        // console.log(getCacheData)

        // if key is not present then set a key
        if(getCacheData){
            console.log('GET Cache');
            const user = await users.find();
            // console.log(user);
            res.status(200).json({
                message:'User successfully retrieved GET Cache',
                  status:200,
                result: user
            });
        }else{
            console.log('Set Cache')
            const user = await users.find();
            // console.log(user);
            redisClient.set(keyName, JSON.stringify(user),{EX:30});
            res.status(200).json({
                message:'User successfully retrieved Set Cache',
                  status:200,
                  result: user
            });

        }
       
        // not use in redis caching code 
        
       
         
        
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status:'Failed',
            result: error
        })
    }
}

// Get User By ID 
export const getUserById = async (req, res, next) => {
    try {

        let keyNameUserById = 'userDataId';
        let getCacheUserById = await redisClient.get(keyNameUserById);
       
        if(getCacheUserById){
            console.log('Get Cache By UserById');
            const User = await users.findById(req.params.id);
            res.status(200).json({
                message:'User By ID successfully retrieved Get Cache',
                status: 'Success',
                result: User
            })

        }else{
            console.log('Set Cache By UserById');
           
            const User = await users.findById(req.params.id);
            redisClient.set(keyNameUserById, JSON.stringify(User),{EX:30});
            res.status(200).json({
                message:'User By ID successfully retrieved Set Cache',
                status: 'Success',
                result: User
            })
        }

        
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status:'Failed',
            result: error
        })
    }
}

// Update user By ID
export const updateUser = async (req, res, next) => {
    try {
        const putUser = await users.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true}
        );
        res.status(200).json({
            message:'User successfully updated',
            status: 'Success',
            result: putUser
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status:'Failed',
            result:error
        })
    }
}

// delete user by ID
export const deleteUser = async (req, res, next) => {
    try {
        const User = await users.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message:'User successfully deleted',
            status: 'Success',
            result: User
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status:'Failed',

            result:error
        })
    }
}


// Delete User by ID SOFT DELETE
export const deleteUserSoftDelete = async (req, res, next) => {
    try {
        const User = await users.findByIdAndUpdate(req.params.id,{ deleted: true});
        res.status(200).json({
            message:'User successfully deleted',
            status: 'Success',
            result: User
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status:'Failed',
            result:error
        })
    }
}

