import {Careerform} from '../model';
import errordetail from '../services/error';
import careerform from '../validators/careerform';

const careerformcontroller = {
    async careerform(req,res,next){
        try{
            const {error} = careerform.validate(req.body,{ abortEarly: false });
            if(error){
                return next(errordetail.errors(error))
            }
            const {category,points} = req.body;
            let document;
                document = await Careerform.create({
                    category,
                    points
                })
                document.save();
            res.status(200).json(document);
        }catch(err){
            return next(err)
        }
    },
    async update(req,res,next){
        try{
            const {error} = careerform.validate(req.body);
            if(error){
                return next(errordetail.errors(error))
            }
            const {category,points} = req.body;
            let document;
                document = await Careerform.findOneAndUpdate({_id:req.params.id},{
                    category,
                    points
                },{new:true})
                document.save();
            res.status(200).json(document)
        }catch(err){
            return next(err)
        }
    },
    async destroy(req,res,next){
        let document;
        try{
            document = await Careerform.findOneAndRemove({_id:req.params.id});
            if(!document) return res.status(200).json({message:"Data deleted successfully"});
        }catch(err){
            return next(err)
        }
        res.status(200).json({message:"Data deleted successfully"})
    },
    async index(req,res,next){
        let document;
        try{
            document = await Careerform.find().select('-__updatedAt -__v');
        }catch(err){
            return next(err)
        }
        res.status(200).json(document)
    },
    async index1(req,res,next){
        let document;
        try{
            document = await Careerform.findOne({_id:req.params.id}).select('-__updatedAt -__v');
        }catch(err){
            return next(err)
        }
        res.status(200).json(document)
    }  
}
export default careerformcontroller