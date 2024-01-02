import express from 'express';

import{
createHotel,
updateHotel,
getHotel,
getHotels, 
deleteHotel
} from '../controller/hotel.controller.js';


const router = express.Router();

// create Hotel Route
router.post('/', createHotel);

// updateHotel
router.put('/:id', updateHotel);

// get all
router.get('/', getHotels);

// get by id
router.get('/:id', getHotel);


// Delete aHotel
router.delete('/:id', deleteHotel);


export default router;
