import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
    empcode:{
        type:Number,
        require:true,

    },
    empf_name:{
        type:String,
        required:true,
    },
    empl_name:{
        type:String,
        required:true,
    },
    job:{
        type:String,
        required:true,
    },
    manager:{
        type:Number,
        required:true
    },
    hiredate:{
        type:Date,
        required:true,
    },
    salary:{
        type:Number,
        required:true,
    },
    commission:{
        type:Number,
        
    },
    deptcode:{
        type:Number,
        required:true,
    }
},
{timestamps:true}
);

export default mongoose.model('Employee', EmployeeSchema)