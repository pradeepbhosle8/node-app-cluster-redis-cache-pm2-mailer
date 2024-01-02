import express from 'express';

import {
    createDepartment,
    updateDepartment,
    getAllDeparments,
    getById,
    deleteDeparment
} from '../controller/empcontroller/department.controller.js';

const router = express.Router();


// create a department
router.post('/', createDepartment)

// update department
router.put('/:id', updateDepartment);

// get all departments
router.get('/', getAllDeparments);

// get by id department
router.get('/:id', getById);

// delete by id department
router.delete('/:id', deleteDeparment);

export default router;