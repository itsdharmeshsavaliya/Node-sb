import {Services} from '../model';
import services from '../validators/services';
import multer from 'multer';
import CustomErrorHandler from '../services/customErrorhandler';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
    destination:(req,file,cb) =>{ 
        cb(null,'uploads/services')
    },
    filename:(req,file,cb)=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;

        cb(null,uniqueName)
    }
});

const fileFilter = function (req, file,cb) {
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !=='.svg') {
        return cb(new Error('Only images are allowed'))
    }
    cb(null, true)
};

const handlemultipartdata = multer({storage,fileFilter,limits:{fileSize:1000000 * 5}}).single('image');

const servicescontroller = {
    async services(req,res,next){
        try{
            handlemultipartdata(req,res,async(err)=>{
                if(err){
                    return next (CustomErrorHandler.servererror(err.message));
                }
                let filepath;
                if(req.file){
                    filepath = req.file.filename
                }
                
                if(req.body.types){
                    req.body.types = JSON.parse(req.body.types); 
                } 
                //console.log(req.body)
                if(!filepath){
                    return next(CustomErrorHandler.unprocessedEntity('please select image'))
                }
                const {error} = services.validate(req.body);
                if(error){
                    fs.unlink(`${appRoot}/uploads/services/${filepath}`,(err)=>{
                        if(err){
                            return next(CustomErrorHandler.servererror(err.message))
                        }
                    })
                    return next(error)
                }
                const {name,types,description} = req.body;
                let document;
                    document = await Services.create({
                        image:filepath,
                        name,
                        types,
                        description
                    })
                    document.save();
                res.status(200).json(document)
            })
        }catch(err){
            return next(err)
        }
    },
    async update(req,res,next){
        try{
            const olddocument = await Services.findOne({_id:req.params.id});
            let oldimage = `${olddocument._doc.image}`;
            console.log(oldimage)

            handlemultipartdata(req,res,async (err)=>{
                if(err){
                    return next(CustomErrorHandler.servererror(err.message))
                }
                let filepath;
                if(req.file){
                    filepath = req.file.filename;
                }
                console.log(filepath)
                if(req.body.types){
                    req.body.types = JSON.parse(req.body.types); 
                }
                if(!filepath){
                    return next(CustomErrorHandler.unprocessedEntity('please select image'))
                } 
                const {error} = services.validate(req.body);
                if(error){
                    if(req.file){
                        fs.unlink(`${appRoot}/uploads/services/${filepath}`,(err)=>{
                            if(err){
                                return next(CustomErrorHandler.servererror(err.message))
                            }
                        })
                    }
                    return next(error)
                }
                const {name,types,description} = req.body
                let document
                    document = await Services.findOneAndUpdate({_id:req.params.id},{
                        name,
                        types,
                        ...(req.file && {image:filepath}),
                        description
                    },{new:true});
                if(olddocument.image !== document.image){
                    fs.unlink(`${appRoot}/uploads/services/${oldimage}`,(err)=>{
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
        let document
        try{
            document = await Services.findOneAndDelete({_id:req.params.id});
            if(!document) return res.status(200).json({message:"Data deleted successfully"});
            let imagepath = document._doc.image;
            fs.unlink(`${appRoot}/uploads/services/${imagepath}`,(err)=>{
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
            document = await Services.find().select('-__updatedAt -__v');
        }catch(err){
            return next(err)
        }
        res.status(200).json(document)
    },
    async index1(req,res,next){
        let document;
        try{
            document = await Services.findOne({_id:req.params.id}).select('-__updatedAt -__v');
        }catch(err){
            return next(err)
        }
        res.status(200).json(document)
    }
}
export default servicescontroller;