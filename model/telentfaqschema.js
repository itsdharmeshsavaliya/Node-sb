import mongoose from "mongoose";

const telentfaqschema = new mongoose.Schema({
    title:{
        type:String,
        Required:true
    },
    description:{
        type:String,
        Required:true
    }
})
export default mongoose.model('telentfaq',telentfaqschema,'telentfaq');