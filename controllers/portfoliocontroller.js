import { portfolioinfoschema  } from "../model";
//import portfoliocategoryschema from "../validators/portfolio";
import {portfoliocategoryschema,portfolioschema} from '../validators/portfolio';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import CustomErrorHandler from "../services/customErrorhandler";

const storage = multer.diskStorage({
    destination:(req,file,cb) =>{ 
        cb(null,'uploads/portfolio')
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

const portfoliocontroller = {
    async category(req,res,next){
        try{
            const {error} = portfoliocategoryschema.validate(req.body)
            if(error){
                return next(error);
            } 
            const {categoryname} = req.body;
            let document
                document = await portfolioinfoschema.portfoliocategory.create({
                    categoryname
                })
                document.save()
            res.status(200).json(document)
        }catch(err){
            return next(err)
        }   
    },
    async categoryupdate(req,res,next){
        try{
            const {error} = portfoliocategoryschema.validate(req.body);
            if(error){
                return next(error)
            }
            const {categoryname} = req.body
            let document;
                document = await portfolioinfoschema.portfoliocategory.findOneAndUpdate({_id:req.params.id},{
                    categoryname
                },{new:true})
            res.status(200).json(document)
        }catch(err){
            return next(err)
        }
    },

    async destroy(req,res,next){
        let document;
        try{
            document = await portfolioinfoschema.portfoliocategory.findOneAndRemove({_id:req.params.id});
            if(!document) return res.status(200).json({message:"Data deleted successfully"});
        }catch(err){
            return next(err)
        }
        res.status(200).json({message:"Data deleted successfully"})
    },
    async categoryindex(req,res,next){
        let all = {};
        let portfoliocategory;
        let portfoliodata
        try{
            portfoliocategory = await portfolioinfoschema.portfoliocategory.find();
            let portfolioCategories = await portfolioinfoschema.portfoliocategory.find();
            await Promise.all(portfolioCategories.map(async category => {
                portfoliodata = await portfolioinfoschema.portfolio.find({ category: category._id });
                all[category._id] = portfoliodata
            })); 
        }catch(err){
            return next(err)
        }
        res.status(200).json({portfoliocategory:portfoliocategory,portfoliodata:all})
    },

    async portfolio(req,res,next){
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
                    return next(CustomErrorHandler.unprocessedEntity('please select image'))
                }
                const {error} = portfolioschema.validate(req.body)
                if(error){
                    fs.unlink(`${appRoot}/uploads/portfolio/${filepath}`,(err)=>{
                        if(err){
                            return next(CustomErrorHandler.servererror(err.message))
                        }
                    })
                    return next(error)
                }
                const {category,websitename,websitelink,websitelanguage} = req.body
                let document;
                    document = await portfolioinfoschema.portfolio.create({
                        category,
                        websitename,
                        websitelink,
                        websitelanguage,
                        image:filepath
                    })
                    document.save();
                res.status(200).json(document)
            })
        }catch(err){
            return next(err)
        }
    },

    async portfolioupdate(req,res,next){
        try{
            let olddocument = await portfolioinfoschema.portfolio.findOne({_id:req.params.id});
            let oldimage = `${olddocument._doc.image}`;
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
                    return next(CustomErrorHandler.unprocessedEntity('please select image'))
                }
                const {error} = portfolioschema.validate(req.body)
                if(error){
                    fs.unlink(`${appRoot}/uploads/portfolio/${filepath}`,(err)=>{
                        if(err){
                            return next(CustomErrorHandler.servererror(err.message))
                        }
                    })
                    return next(error)
                }
                const {category,websitename,websitelink,websitelanguage} = req.body
                let document;
                    document = await portfolioinfoschema.portfolio.findOneAndUpdate({_id:req.params.id},{
                        category,
                        websitename,
                        websitelink,
                        websitelanguage,
                        ...(req.file && {image:filepath})
                    },{new:true})
                if(olddocument.image !== document.image){
                    fs.unlink(`${appRoot}/uploads/portfolio/${oldimage}`,(err)=>{
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

    async destroyportfolio(req,res,next){
        let document;
        try{
            document = await portfolioinfoschema.portfolio.findOneAndRemove({_id:req.params.id})
            if(!document) return res.status(200).json({message:"Data deleted successfully"});
            let imagepath = document._doc.image;
            console.log(imagepath)
            fs.unlink(`${appRoot}/uploads/portfolio/${imagepath}`,(err)=>{
                if(err){
                    return next(CustomErrorHandler.servererror(err.message))
                }
            })
        }catch(error){
            return next(error)
        }
            res.status(200).json({message:"Data deleted successfully"})
    },

    async index(req,res,next){
        let document;
        try{
            document = await portfolioinfoschema.portfolio.find().populate('category');
        }catch(err){
            return next(err)
        }
        res.status(200).json(document)
    },

    async index1(req,res,next){
        let all = {};
        try{
            let portfolioCategories = await portfolioinfoschema.portfoliocategory.find();
            let portfolioData;
            await Promise.all(portfolioCategories.map(async category => {
                portfolioData = await portfolioinfoschema.portfolio.find({ category: category._id });
                all[category._id] = portfolioData;
            }));
        }catch(err){
            return next(err)
        }
        // document.forEach(element => {
        //     console.log(element.id)
        //     data = portfolioinfoschema.portfolio.find({ _id: document.id });
        //     console.log(data) 

        // });
        res.status(200).json(all)
    }
}
export default portfoliocontroller