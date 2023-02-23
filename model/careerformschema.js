import mongoose from "mongoose";

const careerformschema = new mongoose.Schema({
    category:{
        type:String,
        required:true
    },
    points:{
        type:[{type:String}],
        required:true
    }
},{timestamps:true})
export default mongoose.model('careerform',careerformschema,'careerforms')