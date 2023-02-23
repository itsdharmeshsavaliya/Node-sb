import { Developertypesinfoschema } from "../model";
import developertypesinfoschema from "../validators/developertypesinfo";
import multer from "multer";
import fs from 'fs';
import path from "path";
import CustomErrorHandler from "../services/customErrorhandler";

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/developertypes')
    },
    filename:(req,file,cb)=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName)
    }
});
const fileFilter = function(req,file,cb){
    var ext = path.extname(file.originalname);
    if(ext != '.png' && ext != '.jpg' && ext !='gif' && ext != 'jpeg' && ext != '.svg'){
        return cb(new Error('Only images are allowed'))
    }
    cb(null,true)

}

const handlemultipartdata = multer({storage,fileFilter,limits:{fileSize:1000000*5}}).single('icon');

const developertypesinfocontroller = {
    async developertypesinfo(req,res,next){
        try{
            handlemultipartdata(req,res,async (err)=>{
                if(err){
                    return next(CustomErrorHandler.servererror(err.message))
                }
                let filepath;
                if(req.file){
                    filepath = req.file.filename
                }
                if(!filepath){
                    return next(CustomErrorHandler.unprocessedEntity("Please select icon"));
                }
                const {error} = developertypesinfoschema.validate(req.body);
                if(error){
                    fs.unlink(`${appRoot}/uploads/developertypes/${filepath}`,(err)=>{
                        if(err){
                            return next(CustomErrorHandler.servererror(err.message))
                        }
                    })
                    return next(error)
                }
                const {developertype,description} = req.body;
                let document;
                document = await Developertypesinfoschema.create({
                    icon:filepath,
                    developertype,
                    description
                })
                document.save();
                res.status(200).json(document)
            })
        }catch(err){
            return next(err)
        }
    },
    async updatedevelopertypesinfo(req,res,next){
        try{
            const olddocument = await Developertypesinfoschema.findOne({_id:req.params.id});
            let oldimage = `${olddocument._doc.icon}`;
            handlemultipartdata(req,res,async (err)=>{
                if(err){
                    return next(CustomErrorHandler.servererror(err.message))
                }
                let filepath;
                if(req.file){
                    filepath = req.file.filename;
                }
                if(!filepath){
                    return next(CustomErrorHandler.unprocessedEntity("Please select icon"))
                }
                const {error} = developertypesinfoschema.validate(req.body);
                if(error){
                    fs.unlink(`${appRoot}/uploads/developertypes/${filepath}`,(err)=>{
                        if(err){
                            return next(CustomErrorHandler.servererror(err.message))
                        }
                    })
                    return next(error)
                }
                const {developertype,description} = req.body;
                let document;
                document = await Developertypesinfoschema.findOneAndUpdate({_id:req.params.id},{
                    ...(req.file && {icon:filepath}),
                    developertype,
                    description
                },{new:true})
                if(olddocument.icon != document.icon){
                    fs.unlink(`${appRoot}/uploads/developertypes/${oldimage}`,(err)=>{
                        if(err){
                            return next(CustomErrorHandler.servererror(err.message))
                        }
                    })
                }
                res.status(200).json(document)
            })
        }catch(err){
            return next(err)
        }
    },
    async destroy(req,res,next){
        let document;
        try{
            document = await Developertypesinfoschema.findOneAndRemove({_id:req.params.id});
            if(!document) return res.status(200).json({message:"Data deleted successfully"})
            let imagepath = document._doc.icon;
            fs.unlink(`${appRoot}/uploads/developertypes/${imagepath}`,(err)=>{
                if(err){
                    return next(CustomErrorHandler.servererror(err.message))
                }
            })
        }catch(err){
            return next(err)
        }
        res.status(200).json({message:"Data deleted successfully"})
    },
    async index(req,res,next){
        let document;
        try{    
            document = await Developertypesinfoschema.find().select('-updatedAt -v');
        }catch(err){
            return next(err)
        }
        res.status(200).json(document)
    },
    async index1(req,res,next){
        let document;
        try{
            document = await Developertypesinfoschema.findOne({_id:req.params.id}); 
        }catch(err){
            return next(err)
        }
        res.status(200).json(document)
    }
}
export default developertypesinfocontroller