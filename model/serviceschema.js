import mongoose from "mongoose";
import { APP_URL } from "../config";

const serviceschema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    image:{
        type:String,
        required:true,
        get:(image)=>{
            return (image) ? `${APP_URL}/uploads/service/${image}`:'';
        }
    }
},{timestamps:true, toJSON:{getters:true},id:false});

export default mongoose.model('service',serviceschema,'services')