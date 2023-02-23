import {Career} from '../model';
import career from '../validators/career';
import errordetail from '../services/error';

const careercontroller = {
    async career(req,res,next){
        try{
            console.log(req.body)
            const {error} = career.validate(req.body,{ abortEarly: false });
            if(error){ return next(errordetail.errors(error))
                // return res.status(500).json({"error":errorData})
            }
            console.log(req.body)
            const {language_icon,title,position,experience,status} = req.body;
            let document;
                document = await Career.create({
                    // language_icon:language_icon.toUpperCase(),
                    language_icon,
                    title,
                    position,
                    experience,
                    status
                })
                document.save();
                res.status(200).json(document);
        }catch(err){
            return next(err)
        }
    },

    async update(req,res,next){
        try{
            const {error} = career.validate(req.body);
            if(error){
                return next(errordetail.errors(error))
            }
            const {language_icon,title,experience,position,status} = req.body;
            let document;
                document = await Career.findOneAndUpdate({_id:req.params.id},{
                    // language_icon:language_icon.toUpperCase(),
                    language_icon,
                    title,
                    experience,
                    position,
                    status
                },{new:true})
                document.save()
            res.status(200).json(document)
        }catch(err){
            return next(err)
        }
    },

    async destroy(req,res,next){
        let document;
        try{
            document = await Career.findOneAndRemove({_id:req.params.id});
            if(!document) return res.status(200).json({message:"Data deleted successfully"})
        }catch(err){
            return next(err)
        }
        res.status(200).json(document)
    },

    async index(req,res,next){
        const {isapplyApi} = req.body;
        let document;
        try{
            document = await Career.find().select('-__updatedAt -__v');
            if(isapplyApi){
                let documents = [];
                document.map((value)=>{
                    documents.push({
                        lable:value._id,
                        value:value.title
                    })
                })
                res.status(200).json(documents);
            }else{
                res.status(200).json(document);
            }
        }catch(err){
            return next(err)
        }
    },
    
    async index1(req,res,next){
        let document;
        try{
            document = await Career.findOne({_id:req.params.id});
        }catch(err){
            return next(err)
        }
        res.status(200).json(document)
    }
}
export default careercontroller