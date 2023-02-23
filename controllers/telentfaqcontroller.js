import { Telentfaqschema } from "../model";
import errordetail from "../services/error";
import telentfaqschema from "../validators/telentfaq";

const telentfaqcontroller = {
    async telentfaq(req,res,next){
        try{
            const {error} = telentfaqschema.validate(req.body,{abortEarly: false});
            if(error){
                return next(errordetail.errors(error))
            }
            const {title,description} = req.body;
            let document;
            document = await Telentfaqschema.create({
                title,
                description
            })
            document.save();
            res.status(200).json(document)
        }catch(err){
            return next(err)
        } 
    },
    async updatetelentfaq(req,res,next){
        try{
            const {error} = telentfaqschema.validate(req.body,{abortEarly:false});
            if(error){
                return next(errordetail.errors(error))
            }
            const {title,description} = req.body;
            let document;
            document = await Telentfaqschema.findOneAndUpdate({_id:req.params.id},{
                title,
                description
            },{new:true})
            res.status(200).json(document)
        }catch(err){
            return next(err)
        }
    },
    async destroy(req,res,next){
        let document;
        try{
            document = await Telentfaqschema.findOneAndRemove({_id:req.params.id});
            if(!document) return res.status(200).json({message:"Data deleted Successfully"})
        }catch(err){
            return next(err)
        }
        res.status(200).json({message:"Data deleted Successfully"})
    },

    async index(req,res,next){
        let document;
        try{
            document = await Telentfaqschema.find().select('-updatedAt -v');
        }catch(err){
            return next(err)
        }
        res.status(200).json(document)
    },

    async index1(req,res,next){
        let document;
        try{
            document = await Telentfaqschema.findOne({_id:req.params.id});
        }catch(err){
            return next(err)
        }
        res.status(200).json(document)
    }
}
export default telentfaqcontroller