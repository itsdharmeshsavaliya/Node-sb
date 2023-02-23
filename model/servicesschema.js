import mongoose from "mongoose";
import { APP_URL } from "../config";

const typeschema = new mongoose.Schema({
    title:{
        type:String,         
        required:true
    },
    link:{
        type:String,
        required:true
    }
}, {
    _id:false
});
const servicesschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    types:[typeschema],
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true,
        get:(image)=>{
            return (image) ? `${APP_URL}/uploads/services/${image}`: '';
        }

    }
},{timestamps:true,toJSON:{getters:true},id:false});

export default mongoose.model('services',servicesschema,'service');