import users from '../model/user.model.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

import jwt from 'jsonwebtoken';
import { sendEmail } from '../helper/mailer.js';



//secret JWT Token
const SECRET_JWT_TOKEN ='dgfgpspdifgskdfngussj490385jsp8ms';


export const  signupuser  =async (req, res, next) => {

    let code = Math.floor(100000 + Math.random() * 900000);
    let expiry = Date.now() + 60 * 1000 * 15; //15 mins in ms
    
    const userData ={
        _id: new mongoose.Types.ObjectId(),
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        password: bcrypt.hashSync(req.body.password,10),
        // status: req.body.status,
        emailToken: code,
        emailTokenExpires: expiry,
        // resetPasswordToken: req.body.resetPasswordToken,
        // resetPasswordExpires: req.body.resetPasswordExpires,
        // accessToken: req.body.accessToken
        
    }

    const newUser = new users(userData);

    // console.log(userData)
    try {
      
        var email= req.body.email;
        // console.log("Email :"+ email);
        var first_name = req.body.first_name;
        // console.log("first_name :"+ first_name);
        var last_name = req.body.last_name;
        // console.log("last_name :"+ last_name);
        const sendCode = await sendEmail(email, first_name, last_name, code);
        // console.log("SendCode :" + sendCode);

        
        console.log(newUser)

        if (sendCode.error) {
            return res.status(500).json({
              error: true,
              message: "Couldn't send verification email.",
            });
          }
          

        const saveUser = await newUser.save();
        res.status(200).json({
            message:'User successfully Inserted',
            status: 'Success',
            result: saveUser
        });
        
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status:'Failed',
            result: error
        })
    }


}



export const Activate = async (req, res) => {
    try {
        const { email, first_name, last_name, code } = req.body;
        // console.log(email, code)
        if (!email || !code) {
            return res.json({
              error: true,
              status: 400,
              message: "Please make a valid request",
            });
          }

          const user = await users.findOne({
            email: email,
            emailToken: code,
            emailTokenExpires: { $gt: Date.now() },
          });
          console.log(user)

          if (!user) {
            return res.status(400).json({
              error: true,
              message: "Invalid details",
            });
          } else {
            if (user.active)
              return res.send({
                error: true,
                message: "Account already activated",
                status: 400,
              });
      
            user.emailToken = "";
            user.emailTokenExpires = null;
            user.active = true;
      
            await user.save();
      
            return res.status(200).json({
              success: true,
              message: "Account activated.",
            });
          }
    } catch (error) {
        console.error("activation-error", error);
        return res.status(500).json({
          error: true,
          message: error.message,
        });
    }
}




export const loginUser = async (req, res, next) => {

    try {

        const { email, password } = req.body;
        // console.log( email, password )
        if (!email || !password) {
            return res.status(400).json({
              error: true,
              message: "Cannot authorize user.",
            });
          }


        //1. Find if any account with that email exists in DB
        const user = await users.findOne({ email: email });
          // console.log(user)
        // NOT FOUND - Throw error
        if (!user) {
            return res.status(404).json({
            error: true,
            message: "Account not found",
            });
            
        }

        //2. Throw error if account is not activated
        if (!user.active) {
            return res.status(400).json({
            error: true,
            message: "You must verify your email to activate your account",
            });
        }
        
         //3. Verify the password is valid
         const passwordIsValid = bcrypt.compareSync(
            password,
            user.password
        )
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: 'Invalid Password'
            })
        }
        
        // console.log(user._id, user.isAdmin)
       // Sign in token with user id
       var token = jwt.sign({
        id: user._id,
       isAdmin:user.isAdmin
    }, SECRET_JWT_TOKEN, {
        expiresIn: 86400 // 24 hours
    })

   
      // responding to client request with user profile sucess message and access token.
      // expires:new Date(Date.now() + 50000)



      res.cookie( 'access_token', token, {httpOnly: true,  } )
          .status(200).send({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            email:user.email,
            isAdmin:user.isAdmin
        }
    
       
    )
   
    } catch (error) {
        res.status(500).json({
            message: error.message,
            status:'Failed',
            result:error
        })
    }

}

export const forgotPassword = async (req, res) => {
    try {
        const {email, first_name, last_name } =req.body;
        // console.log(email); 
        if(!email){
           return  res.status(401).send({
                status:400,
                error: true,
                message: 'Cannot be processed'
            })
        }

        const user = await users.findOne({email: email})
        // console.log(user)
        if(!user){
            return res.send({
                success: true,
                message:  "If that email address is in our database, we will send you an email to reset your password",
            })
        }

        let code = Math.floor(100000 + Math.random() * 900000);
        console.log(code);

        let response = await sendEmail(user.email, user.first_name, user.last_name, code);
        // console.log(response);

        if(response.error){
            return res.status(500).send({
                error: true,
                message: "Couldn't send mail. Please try again later.",
            })
        }

        let expiry = Date.now() + 60 * 1000 * 15;
        user.resetPasswordToken = code;
        user.resetPasswordExpires = expiry; // 15 minutes

        await user.save();

        return res.send({
            success: true,
            message:"If that email address is in our database, we will send you an email to reset your password",
          });

    } catch (error) {
        console.error("forgot-password-error", error);

        return res.status(500).json({
        error: true,
        message: error.message,
        });
    }
}


export const resetPassword = async(req, res, next) => {
    try {
        
        const { resetPasswordToken, newPassword, confirmPassword } = req.body;
        console.log(resetPasswordToken, newPassword, confirmPassword);

        if(!resetPasswordToken || !newPassword || !confirmPassword){
            return res.status(403).send({
                error: true,
                message: "Couldn't process request. Please provide all mandatory fields",
            })
        }

        const user = await users.findOne({
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() },
          });
        
          console.log(user);
        if (!user) {
            return res.send({
              error: true,
              message: "Password reset token is invalid or has expired.",
            });
          }
          
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
              error: true,
              message: "Passwords didn't match",
            });
          }  

          console.log(req.body.newPassword);
          let testabc = bcrypt.hashSync(req.body.newPassword,10)
          console.log(testabc)
          const hash = await testabc;
          console.log(hash)
          user.password = hash;
          user.resetPasswordToken = null;
          user.resetPasswordExpires = "";
      
          await user.save();
      
          return res.send({
            success: true,
            message: "Password has been changed",
          });  


    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Error Message Catch: "+error.message,
          });
    }
}