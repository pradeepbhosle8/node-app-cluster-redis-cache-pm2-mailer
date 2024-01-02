import express from 'express';

import {
  
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    deleteUserSoftDelete,
  
} from '../controller/user.controller.js';

import {
    loginUser,
    signupuser,
    Activate,
    forgotPassword,
    resetPassword
} from '../controller/auth.controller.js';

import {
verifyToken,
verifyAdmin,
verifyUser
} from '../helper/verifyingToken.js'

const router = express.Router();

// checking verifyToken function working
router.get("/checkauthentication", verifyToken, (req,res,next)=>{
  res.send("hello user, you are logged in")
})

router.get("/checkuser/:id", verifyUser, (req,res,next)=>{
  res.send("hello user, you are logged in and you can delete your account")
})

router.get("/checkadmin", verifyAdmin, (req,res,next)=>{
  res.send("hello admin, you are logged in and you can delete all accounts")
})

// singup users
router.post('/', signupuser );

// activate user
router.patch('/activate', Activate );

// get All users 
router.get('/',verifyAdmin, getUsers ); 

// get UserById 
router.get('/:id',verifyUser, getUserById); 

// update User by id
router.put('/:id',verifyUser, updateUser);

// Delete User by id
// router.delete('/:id', deleteUser);

// Delete User by id and Soft Delete user
router.delete('/:id',verifyUser, deleteUserSoftDelete);

// login user
router.post('/login', loginUser);

// Forgot Password
router.patch('/forgotPassword', forgotPassword);

// reset Password
router.patch('/resetPassword', resetPassword);



export default router;