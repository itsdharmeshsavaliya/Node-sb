import mongoose from "mongoose";
import { APP_URL } from "../config";

const galleryschema = new mongoose.Schema({
    image:{
        type:String,
        required:true,
        get:(image)=>{
            return (image)?`${APP_URL}/uploads/gallery/${image}`:'';
        }}
},{timestamps:true,toJSON:{getters:true},id:false})

export default mongoose.model('gallery',galleryschema,'gallerys')