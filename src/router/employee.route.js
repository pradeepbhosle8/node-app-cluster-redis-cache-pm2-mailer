import express from 'express';

import {
createEmployee,
updateEmployee,
getEmployees,
getEmployeesById,
deleteEmployee
} from '../controller/empcontroller/emplyee.controller.js';

const router = express.Router();

// create new Employee
router.post('/', createEmployee);

// Update previous employee
router.put('/:id', updateEmployee);

// get All Employee
router.get('/', getEmployees);

// get by id  Employee
router.get('/:id', getEmployeesById);

// delete employee by id
router.delete('/:id', deleteEmployee);


 export default router;