import mongoose from "mongoose";

const futureschema = new mongoose.Schema({
    years_of_experience:{
        type:Number,
        required:true
    },
    websites_delivered:{
        type:Number,
        required:true
    },
    countries_served:{
        type:Number,
        required:true
    },
    satisfied_clients:{
        type:Number,
        required:true
    }

},{timestamps:true})

export default mongoose.model('future',futureschema,'futures') 