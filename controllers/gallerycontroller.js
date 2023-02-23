import {Gallery} from '../model';
import gallery from '../validators/gallery';
import multer from 'multer';
import path from 'path';
import CustomErrorHandler from '../services/customErrorhandler';
import fs from 'fs';

const storage = multer.diskStorage({
    destination:(req,file,cb) =>{ 
        cb(null,'uploads/gallery')
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

const gallerycontroller = {

    async gallery(req,res,next){
        try{
            handlemultipartdata(req,res,async(err)=>{
                if(err){
                    return next(CustomErrorHandler.servererror(err.message))
                }
                let filepath;
                if(req.file){
                    filepath = req.file.filename
                    console.log(req.file)
                }
                if(!filepath) return next(CustomErrorHandler.unprocessedEntity('please select image'))
                const {error} = gallery.validate(req.body);
                if(error){
                    fs.unlink(`${appRoot}/uploads/gallery/${filepath}`,(err)=>{
                        if(err){
                            return next(CustomErrorHandler.servererror(err.message))
                        }
                    })
                    return next(error)
                }
                let document;
                    document = await Gallery.create({
                        image:filepath
                    })
                res.status(200).json(document);
            })
        }catch(err){
            return next(err)
        }
    },

    async update(req,res,next){
        try{
            const olddocument = await Gallery.findOne({_id:req.params.id});
            const oldimage = `${olddocument._doc.image}`;
            console.log(oldimage);

            handlemultipartdata(req,res,async (err)=>{
                if(err){
                    return next(CustomErrorHandler.servererror(err.message));
                }
                let filepath;
                if(req.file){
                    filepath = req.file.filename;
                }
                if(!filepath) return next(CustomErrorHandler.unprocessedEntity('please select image'))
                const {error} = gallery.validate(req.body)
                if(error){
                    if(req.file){
                        fs.unlink(`${appRoot}/uploads/gallery/${filepath}`,(err)=>{
                            if(err){
                                return next(CustomErrorHandler.servererror(err.message))
                            }
                        })
                    }
                    return next(error)
                }
                let document;
                    document = await Gallery.findOneAndUpdate({_id:req.params.id},{
                        ...(req.file && {image:filepath})
                    },{new:true})
                if(olddocument.image !== document.image){
                    fs.unlink(`${appRoot}/uploads/gallery/${oldimage}`,(err)=>{
                        if(err){
                            return next(CustomErrorHandler.servererror())
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
            document = await Gallery.findOneAndRemove({_id:req.params.id});
            if(!document) return res.status(200).json({message:"Data deleted successfully"});
            let imagepath = document._doc.image;
            fs.unlink(`${appRoot}/uploads/gallery/${imagepath}`,(err)=>{
                if(err){
                    return next(CustomErrorHandler.servererror(err)) 
                }   
            })
        }catch(err){
            return next(err)
        }
        res.status(200).json(document)
    },
    async index(req,res,next){
        let document;
        try{
            document = await Gallery.find().select('-__updatedAt -__v');
        }catch(err){
            return next(err)
        }
        res.status(200).json(document);
    },
    async getGallery(){
        let documents = [];
        try{
            documents = await Gallery.find().select('-updatedAt -__v');
        }catch(err){}   
            return documents;
    },
    async index1(req,res,next){
        let document;
        try{
            document = await Gallery.findOne({_id:req.params.id}).select('-__updatedAt -__v');
        }catch(err){
            return next(err);
        }
        res.status(200).json(document)
    }
}
export default gallerycontroller
