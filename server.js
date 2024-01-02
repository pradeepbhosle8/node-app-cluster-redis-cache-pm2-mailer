
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

import cluster from 'cluster';
import os from 'os';

import responseTime from 'response-time';

// router settings
import userRoute from './src/router/user.route.js';  // user route
import hotelRoute from './src/router/hotel.route.js'; // hotel route
// department Routes
import departmentRoute from './src/router/department.route.js';
import employeeRoute from './src/router/employee.route.js';

// cookies parcer
import cookieParser from 'cookie-parser';

const numCpu = os.cpus().length;

if(cluster.isPrimary){
    for(let i = 0; i < numCpu; i++){
        cluster.fork();
    }

    cluster.on('exit', (worker, code , signal) =>{
        console.log(`Worker ${worker.process.pid} is died`);
        cluster.fork();
    })
}else{



// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const morgan = require('morgan');


// mongoose db connection settings
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/pradeep', {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true
}).then(()=>{
    console.log('MongoDb Connection Successful ');
}).catch((err)=>{
    console.log('No Connection' + err)
})


mongoose.connection.on('disconnected', () => {
    console.log('MongoDb Disconnected!')
}) 






const app = express();

// middleware setup
app.use(morgan('combined'));
app.use(cors());
app.use(cookieParser())

// request of content application json
app.use(bodyParser.json());

// request of content application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended:true}));

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
      success: false,
      status: errorStatus,
      message: errorMessage,
      stack: err.stack,
    });
  });



// public static html display function

// app.use(express.static(__dirname + '/public'));
// app.set('view engine', 'hbs')

app.get('/', (req, res, next) => {
    res.send({
        message: `Working Api Successfully  ${process.pid}`
    })
})

// response time 
app.use(responseTime());

// routers
app.use('/api/users', userRoute); // user route 
app.use('/api/hotels', hotelRoute); // group route
// department route
app.use('/api/department', departmentRoute); 
app.use('/api/employees', employeeRoute);


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
})


// PORT defined
const PORT = process.env.PORT || 3001;
app.listen(PORT,()=>{
    console.log(`server listening on this ${PORT} - ${process.pid}`)
})

}