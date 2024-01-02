import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true,'First Name is required'],
        trim:true,
        minlength: 2,
        maxlength:30
    },
    last_name: {
        type: String,
        required: [true,'Last Name is required'],
        trim:true,
        minlength: 2,
        maxlength:30
    },
    username: {
        type: String,
        required: [true,'Username is required'],
        unique: true,
        trim:true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim:true,
        validate:{
            validator: async function(email){
                const user = await this.constructor.findOne({ email });
                console.log(user);
                if(user){
                    if(this.id === user.id){
                        return true;
                    }
                    return false;
                }
               
                return true;
              
            },
            message: props => 'A user is already registered with this email address.',
        },
        required: [true,'Email ID is Required'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
      
       
        
    },
    emailToken: { type: String, default: null },
    emailTokenExpires: { type: Date, default: null },
    phone:{
        type: String,
        required:[true,'Phone Number is Required'],
        unique: true,
        trim:true,
        validate:{
            validator: async function(phone){
                const userPhone = await this.constructor.findOne({ phone });
                if(userPhone){
                    if(this.id === userPhone.id){
                        return true;
                    }
                    return false;
                }
                return true;
            },
            message: props => 'A user Phone is already registered ',

        },
        match: [/^\d{10}$/, 'Provided phone number is invalid.']
    },
    password: {
        type: String,
        required:[true,'Password is Required'],
        trim:true
    },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    accessToken: { type: String, default: null },
    isAdmin:{
        type:Boolean,
        default: false
    },
    deleted:{
        type:Boolean,
        index:true,
        default:false
    },
    active: { type: Boolean, default: false },
},
{timestamps:true}
);





export default mongoose.model('users', UserSchema);


