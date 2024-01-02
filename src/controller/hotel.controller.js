import Hotel from '../model/Hotel.model.js';
import mongoose from 'mongoose';


//####### Redis ######//
import redis from 'redis';
//#### axios ######//
import axios from 'axios';
//#### node Fetch ######//
import fetch from 'node-fetch';

// Redis configuration
const redisClient = redis.createClient(6379,'127.0.0.1');
redisClient.connect();
redisClient.on('Connect', function(err){
    console.log('Connected to redis');
})

// create Hotel
export const createHotel = async(req, res, next)=>{


 const newHotel = new Hotel(req.body);

 try {
    const saveHotel = await newHotel.save();
    res.status(200).send({
        message:'Hotel was successfully created',
        status:200,
        result: saveHotel
    })
 } catch (error) {
    res.status(500).send({
        message:error.message,
        status:500,
        result: error
    })
 }


}

// updateHotel
export const updateHotel = async(req, res, next)=>{
    try {
    const updateHotel = await Hotel.findByIdAndUpdate(
        req.params.id,
        {$set: req.body},
        {new: true}
        )
        res.status(200).send({
            message:'Hotel was successfully updated',
            status:200,
            result: updateHotel
        })
    } catch (error) {
        res.status(500).send({
            message:error.message,
            status:500,
            result: error
        })
    }

}

// delete Hotel soft delete
export const deleteHotel = async(req, res, next)=>{
   try {
        const hotel = await Hotel.findByIdAndDelete(
        req.params.id,
        {deleted: true}
    )
    res.status(200).send({
        message:'Hotel was successfully deleted',
        status:200,
        result: hotel
    })
   } catch (error) {
    res.status(500).send({
        message:error.message,
        status:500,
        result: error
    })
   }
}

// get Single Hotel    
export const getHotel = async(req, res, next)=>{
   try {
    const hotelById = await Hotel.findById(req.params.id);
    console.log(hotelById)
    res.status(200).send({
        message:'Hotel By Id was successfully retrieved',
        status:200,
        result: hotelById
    })
   } catch (error) {
        res.status(500).send({
            message:error.message,
            status:500,
            result: error
        })
   }
}

// get all Hotels
export const getHotels = async(req, res, next)=>{
    
}


