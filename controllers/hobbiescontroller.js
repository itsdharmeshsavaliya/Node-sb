import { userprofileinfoschema } from "../model";
import {hobbiesschema} from '../validators/userprofile';
import multer from "multer";
import fs from 'fs';
import path from 'path';
import CustomErrorHandler from "../services/customErrorhandler";

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/hobbies')
    },
    filename:(req,file,cb)=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName)
    }
});

const fileFilter = function(req,file,cb){
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !=='.svg') {
        return cb(new Error('Only images are allowed'))
    }
    cb(null, true)
};

const handlemultipartdata = multer({storage,fileFilter,limits:{fileSize:1000000*5}}).single('icon');
const hobbiescontroller = {
    async hobbies(req,res,next){
        try{
            handlemultipartdata(req,res,async (err)=>{
                if(err){
                    return next(CustomErrorHandler.servererror(err.message))
                }
                let filepath;
                if(req.file){
                    filepath = req.file.filename
                    console.log(filepath)
                }
                if(!filepath){
                    return next(CustomErrorHandler.unprocessedEntity('Please select icon'));
                }
                const {error} = hobbiesschema.validate(req.body);
                if(error){
                    fs.unlink(`${appRoot}/uploads/hobbies/${filepath}`,(err)=>{
                        if(err){
                            return next(CustomErrorHandler.servererror(err.message))
                        }
                    })
                    return next(error)
                }
                let {hobbies} = req.body;
                let document;
                    document = await userprofileinfoschema.hobbies.create({
                        icon:filepath,
                        hobbies
                    })
                    document.save();
                res.status(200).json(document);
            })
        }catch(err){
            return next(err)
        }
    },

    async hobbiesupdate(req,res,next){
        try{
            let olddocument = await userprofileinfoschema.hobbies.findOne({_id:req.params.id});
            let oldimage = `${olddocument._doc.icon}`;
            console.log(oldimage)

            handlemultipartdata(req,res,async (err)=>{
                if(err){
                    return next(CustomErrorHandler.servererror(err.message))
                }
                let filepath;
                if(req.file){
                    filepath = req.file.filename
                }
                if(!filepath){
                    return next(CustomErrorHandler.unprocessedEntity('Please select icon'))
                }
                const {error} = hobbiesschema.validate(req.body)
                if(error){
                    fs.unlink(`${appRoot}/uploads/hobbies/${filepath}`,(err)=>{
                        if(err){
                            return next(CustomErrorHandler.servererror(err.message))
                        }
                    })
                    return next(error)
                }
                const {hobbies} = req.body;
                let document;
                    document = await userprofileinfoschema.hobbies.findOneAndUpdate({_id:req.params.id},{
                        ...(req.file && {icon:filepath}),
                        hobbies
                    },{new:true})
                if(olddocument.icon !== document.icon){
                    fs.unlink(`${appRoot}/uploads/hobbies/${oldimage}`,(err)=>{
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
            document = await userprofileinfoschema.hobbies.findOneAndRemove({_id:req.params.id});
            if(!document) return res.status(200).json({message:"Data deleted successfully"});
            let imagepath = await document._doc.icon;
            console.log(imagepath)
            fs.unlink(`${appRoot}/uploads/hobbies/${imagepath}`,(err)=>{
                if(err){
                    return next(CustomErrorHandler.servererror(err.message))
                }
            })
        }catch(error){
            return next(error)
        }
        res.status(200).json({message:"Data deleted successfully"});
    },

    async index(req,res,next){
        let document;
        try{
            document = await userprofileinfoschema.hobbies.find();
        }catch(err){
            return next(err)
        }
        res.status(200).json(document)
    },

    async index1(req,res,next){
        let document;
        try{
            document = await userprofileinfoschema.hobbies.findOne({_id:req.params.id})
        }catch(err){
            return next(err)
        }
        res.status(200).json(document)
    }
}
export default hobbiescontroller