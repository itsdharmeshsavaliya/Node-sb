import mongoose from "mongoose";
import {APP_URL} from '../config';
const developertypesinfoschema = new mongoose.Schema({
    icon : {
        type:String,
        required:true,
        get:(image)=>{
            return (image) ? `${APP_URL}/uploads/developertypes/${image}`:'';
        }
    },
    developertype:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
},{timestamps:true,toJSON:{getters:true},id:false});

export default mongoose.model('developertypesinfo',developertypesinfoschema,'developertypesinfo')