import { userprofileinfoschema } from "../model";
import { pmstoolsschema } from "../validators/userprofile";
import multer from "multer";
import fs from 'fs';
import path from "path";
import CustomErrorHandler from "../services/customErrorhandler";

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/pmstools')
    },
    filename:(req,file,cb)=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName)
    }
});

const filefilter = (req,file,cb)=>{
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext  !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.svg'){
        return cb(new Error('Only images are allowed'))
    }
    cb(null,true)
}

const handlemultipartdata = multer({storage,filefilter,limits:{fileSize:1000000*5}}).single('logo');
const pmstoolscontroller = {
    async pmstools(req,res,next){
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
                    return next(CustomErrorHandler.unprocessedEntity('Please select image'));
                }
                const {error} = pmstoolsschema.validate(req.body);
                if(error){
                    fs.unlink(`${appRoot}/uploads/pmstools/${filepath}`,(err)=>{
                        if(err){
                            return next(CustomErrorHandler.servererror(err.message))
                        }
                    })
                    return next(error)
                }
                const {title} = req.body;
                let document;
                    document = await userprofileinfoschema.pmstools.create({
                        title,
                        logo:filepath
                    })
                    document.save();
                res.status(200).json(document)
            })
        }catch(err){
            return next(err)
        }
    },

    async pmstoolsupdate(req,res,next){
        try{
            let olddocument = await userprofileinfoschema.pmstools.findOne({_id:req.params.id});
            let oldimage = `${olddocument._doc.logo}`;
            console.log(oldimage);

            handlemultipartdata(req,res,async (err)=>{
                if(err){
                    return next(CustomErrorHandler.servererror(err.message))
                }
                let filepath;
                if(req.file){
                    filepath = req.file.filename
                }
                if(!filepath){
                    return next(CustomErrorHandler.unprocessedEntity('please select image'));
                }
                const {error} = pmstoolsschema.validate(req.body)
                if(error){
                    fs.unlink(`${appRoot}/uploads/pmstools/${filepath}`,(err)=>{
                        if(err){
                            return next(CustomErrorHandler.servererror(err.message))
                        }
                    })
                    return next(error)
                }
                const {title} = req.body;
                let document;
                    document = await userprofileinfoschema.pmstools.findOneAndUpdate({_id:req.params.id},{
                        title,
                        ...(req.file && {logo:filepath})
                    },{new:true})
                if(olddocument.logo !== document.logo){
                    fs.unlink(`${appRoot}/uploads/pmstools/${oldimage}`,(err)=>{
                        if(err){
                            return next(CustomErrorHandler.servererror(err.message))
                        }
                    })
                }
                res.status(200).json(document);
            })
        }catch(err){
            return next(err)
        }
    },

    async destroy(req,res,next){
        let document;
        try{
            document = await userprofileinfoschema.pmstools.findOneAndRemove({_id:req.params.id});
            if(!document) return res.status(200).json({message:"Data deleted successfully"})
            let imagepath = `${document._doc.logo}`;
            fs.unlink(`${appRoot}/uploads/pmstools/${imagepath}`,(err)=>{
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
             document = await userprofileinfoschema.pmstools.find();
        }catch(error){
            return next(error)
        }
        res.status(200).json(document)
    },

    async index1(req,res,next){
        let document;
        try{    
            document = await userprofileinfoschema.pmstools.findOne({_id:req.params.id});
        }catch(err){
            return next(err)
        }
        res.status(200).json(document)
    }
}
export default pmstoolscontroller