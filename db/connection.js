import mongoose from "mongoose";
import { MONGO_URI } from "../config";

mongoose.connect(MONGO_URI,{useNewUrlParser:true, useUnifiedTopology:true})
const db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error'))
db.once('open',()=>{
    console.log('DB connected')
})

