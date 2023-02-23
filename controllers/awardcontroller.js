import {Award} from '../model';
import award from '../validators/award';
import multer from 'multer';
import CustomErrorHandler from '../services/customErrorhandler';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
    destination:(req,file,cb) =>{ 
        cb(null,'uploads/award')
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

const awardcontroller = {

    async award(req,res,next){
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
                    return next(CustomErrorHandler.unprocessedEntity("Please select image"))
                }
                const {error} = award.validate(req.body);
                if(error){
                    fs.unlink(`${appRoot}/uploads/award/${filepath}`,(err)=>{
                        if(err){
                            return next(CustomErrorHandler.servererror(err.message))
                        }
                    })
                    return next(error)
                }
                let document;
                try{
                    document = await Award.create({
                        image:filepath
                    })
                    document.save();
                }catch(err){
                    return next(err)
                }
                res.status(200).json(document);
            })
        }catch(err){
            return next(err)
        }    
    },
    async update(req,res,next){
        try {
            handlemultipartdata(req,res,async (err)=>{
                if(err) return next(CustomErrorHandler.servererror(err.message));
                if(!req.file) return next(CustomErrorHandler.unprocessedEntity('please select image'));
    
                const award = await Award.findOne({_id:req.params.id});
                if(!award) return next(new Error('award not found!'));
    
                const {error} = award.validate(req.body);
                if(error){
                    fs.unlink(`${appRoot}/uploads/award/${filepath}`,(err)=>{
                        if(err) return next(CustomErrorHandler.servererror(err.message));
                    })
                    return next(error)
                }
                let document;
                try{
                    document = await Award.findOneAndUpdate({_id:req.params.id},{
                        ...(req.file && {image: req.file.filename})
                    },{new:true})
                }catch(error){
                    if(req.file){
                        fs.unlink(`${appRoot}/uploads/award/${req.file.filename}`,(err)=>{
                            if(err) return next(CustomErrorHandler.servererror(err.message));
                        })
                    }
                    return next(error)
                }
                if(award.image !== document.image){
                    let oldimage = `${award._doc.image}`;
                    fs.unlink(`${appRoot}/uploads/award/${oldimage}`,(err)=>{
                        if(err){    
                            return next(CustomErrorHandler.servererror(err.message))
                        }
                    })
                }
                return res.status(200).json(document)
            }) 
        } catch (error) {
            return next(error)
        }
        
    },
    
    async destroy(req,res,next){
        let document
        try{
            document = await Award.findOneAndRemove({_id:req.params.id});
            if(!document) return res.status(200).json({message:"Data deleted successfully"});
            let imagepath = document._doc.image;
            fs.unlink(`${appRoot}/uploads/award/${imagepath}`,(err)=>{
                if(err){
                    return next(CustomErrorHandler.servererror(err.message))
                }
            })
        }catch(err){
            return next(err)
        }
        res.status(200).json(document)
    },

    async getAward(){
        let documents = [];
        try{
            documents = await Award.find().select('-__updatedAt -__v');
        }catch(error){}
        return documents
    },
    async index(req,res,next){
        let document;
        try{
            document = await Award.find().select('-__updatedAt -__v');
        }catch(err){
            return next(err)
        }
        res.status(200).json(document)
    },
    async index1(req,res,next){
        let document
        try{
            document = await Award.findOne({_id:req.params.id}).select('-__updatedAt -__v');
        }catch(err){
            return next(err)
        }
        res.status(200).json(document)
    }
}
export default awardcontroller;