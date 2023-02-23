import {Future} from '../model';
import errordetail from '../services/error';
import future from '../validators/future';

const futurecontroller = {
    async future(req,res,next){
        try{
            const {error} = future.validate(req.body,{abortEarly:false});
            if(error){
                return next(errordetail.errors(error))
            }
            const {years_of_experience,websites_delivered,countries_served,satisfied_clients} = req.body;
            let document;
                document = await Future.create({
                    years_of_experience,
                    websites_delivered,
                    countries_served,
                    satisfied_clients
                })
                document.save();
            res.status(200).json(document)
        }catch(err){
            return next(err)
        }
    },

    async update(req,res,next){
        try{
            const {error} = future.validate(req.body,{abortEarly:false});
            if(error){
                return next(errordetail.errors(error))
            }
            const {years_of_experience,websites_delivered,countries_served,satisfied_clients} = req.body
            let document;
                document = await Future.findOneAndUpdate({_id:req.params.id},{
                    years_of_experience,
                    websites_delivered,
                    countries_served,
                    satisfied_clients
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
            document = await Future.findOneAndRemove({_id:req.params.id});
            if(!document) return res.status(201).json({message:"Data deleted successfully"});
        }catch(err){
            return next(err)
        }
        res.status(200).json(document);
    },
    async getFuture(){
        let documents = [];
        try{
            documents = await Future.find().select('-__updatedAt -__v');
        }catch(err){}
        return documents;
    },
    async index(req,res,next){
        let document;
        try{
            document = await Future.find().select('-__updatedAt -__v');
        }catch(err){}
        res.status(200).json(document)
    },

    async index1(req,res,next){
        let document;
        try{
            document = await Future.findOne({_id:req.params.id}).select('-__updatedAt -__v');
        }catch(err){
            return next(err)
        }
        res.status(200).json(document)
    }
}
export default futurecontroller;
