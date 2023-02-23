import mongoose from "mongoose";
import { APP_URL } from "../config";

const clientschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true,
        get:(image)=>{
            return (image) ? `${APP_URL}/uploads/client/${image}`: '';
        }
    }
},{timestamps:true,toJSON:{getters:true},id:false})

export default mongoose.model('client',clientschema,'clients')