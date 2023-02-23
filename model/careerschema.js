import mongoose from "mongoose";

const careerschema = new mongoose.Schema({
    language_icon:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    experience:{
        type:String,
        required:true
    },
    position:{
        type:Number,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
},{timestamps:true})
// careerschema.pre('save', function (next) {
//     const words = this.title.split(' ')
//     this.title = words
//     .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
//     .join(' ')
//     next();
//   });
export default mongoose.model('career',careerschema,'careers');