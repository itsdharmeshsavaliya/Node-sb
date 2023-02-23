import mongoose from "mongoose";
import { APP_URL } from "../config";

const portfoliocategoryschema = new mongoose.Schema({
    categoryname: {
        type:String,
        required:true
    },
    status:{
        type:String,
        default:true
    }
})
const portfoliocategory = mongoose.model('portfoliocategory',portfoliocategoryschema,'portfoliocategory');

const portfolioschema = new mongoose.Schema({
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'portfoliocategory'
    },
    websitename:{
        type:String,
        required:true
    },
    websitelink:{
        type:String,
        required:true
    },
    websitelanguage:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true,
        get:(image)=>{
            return (image) ? `${APP_URL}/uploads/portfolio/${image}`:'';
        }

    }
},{timestamps:true,toJSON:{getters:true},id:false});

const portfolio = mongoose.model('portfolio',portfolioschema,'portfolio');

export default {
    portfoliocategory,
    portfolio
}