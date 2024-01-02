import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
    depcode:{
        type:Number,
        require: true,
        unique: true,
        validate:{
            validator: Number.isInteger,
            message: `Department is not an integer value`
        }
    },
    depname:{
        type:String,
        require:true
    },
    location:{
        type:String,
    
    }
},
{timestamps: true}
);


export default mongoose.model('Department', DepartmentSchema);
