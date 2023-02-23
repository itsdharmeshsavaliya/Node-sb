import mongoose from "mongoose";
import { APP_URL } from "../config";

const awardschema = new mongoose.Schema({
    image:{
        type:String,
        required:true,
        get:(image)=>{
            return (image) ? `${APP_URL}/uploads/award/${image}` : '';
        }
    }
},{timestamps:true,toJSON:{getters:true},id:false})
export default mongoose.model('award',awardschema,'awards'); 