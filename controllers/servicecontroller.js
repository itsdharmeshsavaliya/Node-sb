import {Service} from '../model';
import service from '../validators/service';
// import handlemultipartdata from '../helper';
import multer from 'multer';
import CustomErrorHandler from '../services/customErrorhandler';
import fs from 'fs';
import path from 'path';


const storage = multer.diskStorage({
    destination:(req,file,cb) =>{ 
        cb(null,'uploads/service')
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

const servicecontroller = {
    async service(req,res,next){
        try{
            handlemultipartdata(req,res,async (err)=>{
                if(err){
                    return next(CustomErrorHandler.servererror(err.message))
                }
                let filepath;
                if(req.file){
                    filepath = req.file.filename
                    console.log(req.file)
                }
                if(!filepath){
                    return next(CustomErrorHandler.unprocessedEntity('please select image'))
                }
                const {error} = service.validate(req.body)
                if(error){
                        fs.unlink(`${appRoot}/uploads/service/${filepath}`,(err)=>{
                            if(err){
                                return next(CustomErrorHandler.servererror(err.message))
                            }
                        })
                    return next(error)
                }
                const {title} = req.body;
                let document;
                    document = await Service.create({
                        title,
                        image:filepath
                    });
                    document.save();
                res.status(200).json(document)
            })
        }catch(err){
            return next(err)
        }
    },

    async update(req,res,next){
        try{
            const olddocument = await Service.findOne({_id:req.params.id})
            let oldimage =  `${olddocument._doc.image}`;
            console.log(oldimage)

            handlemultipartdata(req,res,async (err)=>{
                if(err){
                    return next(CustomErrorHandler.servererror(err.message))
                }
                let filepath;
                if(req.file){
                    filepath = req.file.filename;
                }
                if(!filepath){
                    return next(CustomErrorHandler.unprocessedEntity('please select image'))
                }
                const {error} = service.validate(req.body);
                if(error){
                    if(req.file){
                        fs.unlink(`${appRoot}/uploads/service/${filepath}`,(err)=>{
                            if(err){
                                return next(CustomErrorHandler.servererror(err.message))
                            } 
                        })
                    }
                    return next(error)
                    }
                const {title} = req.body
                let document;
                        document = await Service.findOneAndUpdate({_id:req.params.id},{
                            title,
                            ...(req.file && {image:filepath})
                        },{new:true});
                    if(olddocument.image !== document.image){
                        fs.unlink(`${appRoot}/uploads/service/${oldimage}`,(err)=>{
                            if(err){
                                return next(CustomErrorHandler.servererror(err.message))
                            }
                            return next(err);
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
             document = await Service.findOneAndRemove({_id:req.params.id});
            if(!document) return res.status(200).json({message:"Data deleted successfully"});
            let imagepath = document._doc.image;
            fs.unlink(`${appRoot}/uploads/service/${imagepath}`,(err)=>{
                if(err){
                    return next(CustomErrorHandler.servererror(err))
                }
            })
        }catch(err){
            return next(err)
        }
        res.status(200).json({message:"Data deleted successfully"})
    },  
    getServices : ()=>{
        let documents = [];
            try{
             documents =  Service.find().select('-__updatedAt -__v');
            }catch(err){}
            return documents;
    },
    async index(req,res,next){
        let document;
        try{
            document = await Service.find().select('-__uodatedAt -__v');
        }catch(error){
            return next(error)
        }
        res.status(200).json(document)
    },  
    // async index(req,res,next){
    //     let documents = await this.getServices();        
    //     res.status(201).json(documents);
    // },

    
    // async getServices() {
    //     let documents = [];
    //     try{
    //         documents = await Service.find().select('-__updatedAt -__v');
    //     }catch(err){}
    //     return documents;
    // },
    async index1(req,res,next){
        let document;
        try{
            document = await Service.findOne({_id:req.params.id}).select('-__updatedAt -__v');
        }catch(err){
            return next(err)
        }
        res.status(200).json(document)
    }
}
export default servicecontroller