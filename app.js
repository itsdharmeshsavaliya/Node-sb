import express from "express";
import path from 'path';
import { APP_PORT } from "./config";
//const port = process.env.PORT || 3000
const app = express();
import './db/connection';
import errorhandler from "./middleware/errorhandler";
import routes from './routes';
import cors from 'cors';

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));


app.set('views','./view')
app.set("view engine","ejs")

global.appRoot = path.resolve(__dirname);
app.use(express.json())
app.use('/api',routes)
app.use('/uploads/portfolio',express.static('/uploads/portfolio'))
app.use('/uploads/banner',express.static('uploads/banner'))
app.use('/uploads/service',express.static('uploads/service'))
app.use('/uploads/gallery',express.static('uploads/gallery'))
app.use('/uploads/award',express.static('uploads/award'))
app.use('/uploads/client',express.static('uploads/client'))
app.use('/uploads/services',express.static('uploads/services'))
app.use('/uploads/portfolio',express.static('uploads/portfolio'))
app.use('/uploads/developertypes',express.static('uploads/developertypes'))
app.use('/uploads/technology',express.static('uploads/technology'))
app.use('/uploads/pmstools',express.static('uploads/pmstools'))
app.use('/uploads/hobbies',express.static('uploads/hobbies'))
app.use('/uploads/userprofile',express.static('uploads/userprofile'))
app.use(errorhandler)
app.listen(APP_PORT,()=>{

    console.log(`listening on port ${APP_PORT}`)
})