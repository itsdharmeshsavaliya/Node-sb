import multer from "multer";
import path from 'path';

let apiName;
let type;
const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        apiName = req._parsedUrl.pathname;
        if(apiName == "/banner") {
            type = "banner";
        } 
        cb(null,`uploads/${type}`)
    },
    filename:(req,file,cb)=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;

        cb(null,uniqueName)
    }
});

const handlemultipartdata = multer({storage,limits:{fileSize:1000000 * 5}}).single('image');

export default handlemultipartdata;