import { userprofileinfoschema } from "../model";
import { userprofileschema } from "../validators/userprofile";
import multer from "multer";
import fs from 'fs';
import path from 'path';
import CustomErrorHandler from "../services/customErrorhandler";
import mongoose from "mongoose";

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/userprofile')
    },
    filename:(req,file,cb)=>{
        const uniqueName = `${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;
        cb(null,uniqueName)
    }
});

const fileFilter = function(req,file,cb){
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.svg') {
        return cb(new Error('Only images are allowed'))
    }
    cb(null, true)
};

const handlemultipartdata = multer({storage,fileFilter,limits:{fileSize:1000000*5}}).single('image');

const userprofilecontroller = {
    async userprofile(req,res,next){
        try{
            handlemultipartdata(req,res,async (err)=>{
                if(err){
                    return next(CustomErrorHandler.servererror(err.message))
                }
                let filepath;
                if(req.file){
                    filepath = req.file.filename
                }
                if(req.body.exp_technology){
                    try{
                        req.body.exp_technology = await JSON.parse(req.body.exp_technology);
                    }catch(err){
                        if(err){
                            fs.unlink(`${appRoot}/uploads/userprofile/${filepath}`,(err)=>{
                                if(err){
                                    return next(CustomErrorHandler.servererror(err.message))
                                }
                            })
                        }
                        return next(CustomErrorHandler.unprocessedEntity("Please select technology"))
                    }
                }
                if(req.body.certi_key_qualities){
                    try{
                        req.body.certi_key_qualities = await JSON.parse(req.body.certi_key_qualities);
                    }catch(err){
                        if(err){
                            fs.unlink(`${appRoot}/uploads/userprofile/${filepath}`,(err)=>{
                                if(err){
                                    return next(CustomErrorHandler.servererror(err.message))
                                }
                            })
                        }
                        return next(CustomErrorHandler.unprocessedEntity("Please enter key qualities"))
                    }
                }
                if(req.body.education){
                    try{
                        req.body.education = await JSON.parse(req.body.education);
                    }catch(err){
                        if(err){
                            fs.unlink(`${appRoot}/uploads/userprofile/${filepath}`,(err)=>{
                                if(err){
                                    return next(CustomErrorHandler.servererror(err.message))
                                }
                            })
                        }
                        return next(CustomErrorHandler.unprocessedEntity("Please select education"))
                    }
                }
                if(req.body.achievements_award){
                    try{
                        req.body.achievements_award = await JSON.parse(req.body.achievements_award);
                    }catch(err){
                        if(err){
                            fs.unlink(`${appRoot}/uploads/userprofile/${filepath}`,(err)=>{
                                if(err){
                                    return next(CustomErrorHandler.servererror(err.message))
                                }
                            })
                        }
                        return next(CustomErrorHandler.unprocessedEntity("Please select award"))
                    }
                }

                if(req.body.interests_section){
                    try{
                        req.body.int_hobbies = await JSON.parse(req.body.int_hobbies);
                        
                    }catch(err){
                        if(err){
                            fs.unlink(`${appRoot}/uploads/userprofile/${filepath}`,(err)=>{
                                if(err){
                                    return next(CustomErrorHandler.servererror(err.message))
                                }
                            })
                        }
                          return next(CustomErrorHandler.unprocessedEntity("Please enter hobbies"));
                    }
                    try{
                        req.body.int_technology = await JSON.parse(req.body.int_technology);
                    }catch(err){
                        if(err){
                            if(err){
                                fs.unlink(`${appRoot}/uploads/userprofile/${filepath}`,(err)=>{
                                    if(err){
                                        return next(CustomErrorHandler.servererror(err.message))
                                    }
                                })
                            }
                        }
                        return next(CustomErrorHandler.unprocessedEntity("Please select technology"));
                    }
                    try{
                        req.body.int_pmstools = await JSON.parse(req.body.int_pmstools);
                    }catch(err){
                        if(err){
                            if(err){
                                fs.unlink(`${appRoot}/uploads/userprofile/${filepath}`,(err)=>{
                                    if(err){
                                        return next(CustomErrorHandler.servererror(err.message))
                                    }
                                })
                            }
                        }
                        return next(CustomErrorHandler.unprocessedEntity("please select pmstool"))
                    }
                }
                // if(req.body.int_hobbies){
                //     req.body.int_hobbies = JSON.parse(req.body.int_hobbies); 
                // }
                // if(req.body.int_technology){
                //     req.body.int_technology = JSON.parse(req.body.int_technology);
                // }
                // if(req.body.int_pmstools){
                //     req.body.int_pmstools = JSON.parse(req.body.int_pmstools);
                // }
                const {error} = userprofileschema.validate(req.body);
                if(error){
                    fs.unlink(`${appRoot}/uploads/userprofile/${filepath}`,(err)=>{
                        if(err){
                            return next(CustomErrorHandler.servererror(err.message))
                        }
                    })
                    return next(error)
                }
                const {name,skill,experience,communication_score,technical_score,
                    expertise_section, exp_technology,
                    certification_section,certi_about,certi_key_qualities,
                    education_section,education,edu_professional_experience,
                    achievements_section,achievements_award,achi_projects,
                    interests_section,int_hobbies,int_technology,int_pmstools} = req.body;
                let document;
                    document = await userprofileinfoschema.userprofile.create({
                        image:filepath,
                        name,
                        skill,
                        experience,
                        communication_score,
                        technical_score,
                        expertise_section,
                        ...(expertise_section && {exp_technology}),
                        certification_section,
                        ...(certification_section && {certi_about,certi_key_qualities}),
                        education_section,
                        ...(education_section && {education,edu_professional_experience}),
                        achievements_section,
                        ...(achievements_section && {achievements_award,achi_projects}),
                        interests_section,
                        ...(interests_section && {int_hobbies,int_technology,int_pmstools})
                    })
                    document.save();
                res.status(200).json(document)
                console.log(document)
            })
        }
        catch(err){
            return next(err)
        }
    },

    async updateuserprofile(req,res,next){
        try{
            const olddocument = await userprofileinfoschema.userprofile.findOne({_id:req.params.id})
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
                console.log(filepath)
                if(req.body.exp_technology){
                    try{
                        req.body.exp_technology = await JSON.parse(req.body.exp_technology);
                    }catch(err){
                        if(err){
                            fs.unlink(`${appRoot}/uploads/userprofile/${filepath}`,(err)=>{
                                if(err){
                                    return next(CustomErrorHandler.servererror(err.message))
                                }
                            })
                        }
                        return next(CustomErrorHandler.unprocessedEntity("Please select technology"))
                    }
                }
                if(req.body.certi_key_qualities){
                    try{
                        req.body.certi_key_qualities = await JSON.parse(req.body.certi_key_qualities);
                    }catch(err){
                        if(err){
                            fs.unlink(`${appRoot}/uploads/userprofile/${filepath}`,(err)=>{
                                if(err){
                                    return next(CustomErrorHandler.servererror(err.message))
                                }
                            })
                        }
                        return next(CustomErrorHandler.unprocessedEntity("Please enter key qualities"))
                    }
                }
                if(req.body.education){
                    try{
                        req.body.education = await JSON.parse(req.body.education);
                    }catch(err){
                        if(err){
                            fs.unlink(`${appRoot}/uploads/userprofile/${filepath}`,(err)=>{
                                if(err){
                                    return next(CustomErrorHandler.servererror(err.message))
                                }
                            })
                        }
                        return next(CustomErrorHandler.unprocessedEntity("Please select education"))
                    }
                }
                if(req.body.achievements_award){
                    try{
                        req.body.achievements_award = await JSON.parse(req.body.achievements_award);
                    }catch(err){
                        if(err){
                            fs.unlink(`${appRoot}/uploads/userprofile/${filepath}`,(err)=>{
                                if(err){
                                    return next(CustomErrorHandler.servererror(err.message))
                                }
                            })
                        }
                        return next(CustomErrorHandler.unprocessedEntity("Please select award"))
                    }
                }
                if(req.body.interests_section){
                    try{
                        req.body.int_hobbies = await JSON.parse(req.body.int_hobbies);
                    }catch(err){
                        if(err){
                            fs.unlink(`${appRoot}/uploads/userprofile/${filepath}`,(err)=>{
                                if(err){
                                    return next(CustomErrorHandler.servererror(err.message))
                                }
                            })
                        }
                          return next(CustomErrorHandler.unprocessedEntity("Please enter hobbies"));
                    }
                    try{
                        req.body.int_technology = await JSON.parse(req.body.int_technology);
                    }catch(err){
                        if(err){
                            if(err){
                                fs.unlink(`${appRoot}/uploads/userprofile/${filepath}`,(err)=>{
                                    if(err){
                                        return next(CustomErrorHandler.servererror(err.message))
                                    }
                                })
                            }
                        }
                        return next(CustomErrorHandler.unprocessedEntity("Please select technology"));
                    }
                    try{
                        req.body.int_pmstools = await JSON.parse(req.body.int_pmstools);
                    }catch(err){
                        if(err){
                            if(err){
                                fs.unlink(`${appRoot}/uploads/userprofile/${filepath}`,(err)=>{
                                    if(err){
                                        return next(CustomErrorHandler.servererror(err.message))
                                    }
                                })
                            }
                        }
                        return next(CustomErrorHandler.unprocessedEntity("Please select pmstool"))
                    }
                }
                const {error} = userprofileschema.validate(req.body);
                if(error){
                    if(req.file){
                        fs.unlink(`${appRoot}/uploads/userprofile/${filepath}`,(err)=>{
                            if(err){
                                return next(CustomErrorHandler.servererror(err.message))
                            }
                        })
                    }
                    return next(error)
                }
                const {name,skill,experience,communication_score,technical_score,
                    expertise_section, exp_technology,
                    certification_section,certi_about,certi_key_qualities,
                    education_section,education,edu_professional_experience,
                    achievements_section,achievements_award,achi_projects,
                    interests_section,int_hobbies,int_technology,int_pmstools} = req.body;
                let document;
                    document = await userprofileinfoschema.userprofile.findOneAndUpdate({_id:req.params.id},{
                        ...(req.file && {image:filepath}),
                        name,
                        skill,
                        experience,
                        communication_score,
                        technical_score,
                        expertise_section,
                        ...(expertise_section && {exp_technology}),
                        // ...(!expertise_section && {exp_technology:[],exp_year:""}),
                        certification_section,
                        ...(certification_section && {certi_about,certi_key_qualities}),
                        education_section,
                        ...(education_section && {education,edu_professional_experience}),
                        achievements_section,
                        ...(achievements_section && {achievements_award,achi_projects}),
                        interests_section,
                        ...(interests_section && {int_hobbies,int_technology,int_pmstools})
                    },{new:true})
                if(olddocument.image != document.image){
                    fs.unlink(`${appRoot}/uploads/userprofile/${oldimage}`,(err)=>{
                        if(err){
                            return next(CustomErrorHandler.servererror(err.message))
                        }
                    })
                }
                res.status(201).json(document)
            })
        }catch(err){
            return next(err)
        }
    },
    async destroyuserprofile(req,res,next){
        let document;
        try{    
            document = await userprofileinfoschema.userprofile.findOneAndRemove({_id:req.params.id})
            if(!document) return res.status(200).json({message:"Data deleted successfully"})
            let imagepath = document._doc.image;
            fs.unlink(`${appRoot}/uploads/userprofile/${imagepath}`,(err)=>{
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
            document = await userprofileinfoschema.userprofile.find().populate('exp_technology.technology_id int_technology int_pmstools');
        }catch(err){
            return next(err)
        }
        res.status(200).json(document)
    },

    async index1(req,res,next){
        let document;
        let id = mongoose.Types.ObjectId(req.params.id);
        try{
            document = await userprofileinfoschema.userprofile.findOne({_id:req.params.id}).populate('exp_technology.technology_id int_technology int_pmstools int_hobbies');
                // {
                //     $lookup: {
                //         "from": 'technology',
                //         "let":{"technologyId":"$exp_technology.technology_id"},
                //         pipeline:[{
                //             "$match":{
                //                 "$expr":{
                //                     "$in": ["$_id","$$technologyId"],
                //                 },
                //             },
                //         },
                //         // {"$project":{"title":1, "exp_year":1}}
                //         // { "$unwind": "$exp_technology" },
                //         // { "$match": { "$expr": { "$eq": ["$exp_technology.technology_id", "$$technologyId"] } } },
                //         // { "$group": {
                //         //     "_id": "$exp_technology.technology_id",
                //         //     "expertiseyear": { "$year": "$exp_technology.exp_year" }
                //         // }}
                //       ],
                //       as: 'exp_technology',
                //     },
                //   },
                // 
                // {
                //         $lookup: {
                //             "from": 'technology',
                //             "let":{"technologyId":"$exp_technology.technology_id"},
                //             pipeline:[{
                //                 "$match":{
                //                     "$expr":{
                //                         "$in": ["$_id","$$technologyId"],
                //                     },
                //                 },
                //             },
                //             {
                //                 "$group": {
                //                     // "exp_technology":"$exp_technology"
                //                     // "technology_id" : "$technology_id",
                //                     // "exp_year":"$exp_year"
                //                     // "name": { "$first": "$name" },   
                //                     // "min" : { "$first": "$attendeeContainer.min" },
                //                     // "max" : { "$first": "$attendeeContainer.max" },
                //                     "_id" : "$_id",
                //                     "exp_technology": { "$push": "$exp_technology" }            
                //                 }
                //             },
                //             //  {"$project":{"title":1, "exp_year":1}}
                //             // { "$unwind": "$exp_technology" },
                //             // { "$match": { "$expr": { "$eq": ["$exp_technology.technology_id", "$$technologyId"] } } },
                //             // { "$group": {
                //             //     "_id": "$exp_technology.technology_id",
                //             //     "expertiseyear": { "$year": "$exp_technology.exp_year" }
                //             // }}
                //           ],
                //           as: 'exp_technology',
                //         },
                //       },
                    
                //{
                //     $lookup: {
                //         "from": 'technology',
                //         "let":{"technologyId":"$exp_technology.technology_id"},
                //         pipeline:[{
                //             "$match":{
                //                 "$expr":{
                //                     "$in": ["$_id","$$technologyId"],
                //                 },
                //             },
                //         },
                //         // {"$project":{"title":1, "exp_year":1}}
                //         // { "$unwind": "$exp_technology" },
                //         // { "$match": { "$expr": { "$eq": ["$exp_technology.technology_id", "$$technologyId"] } } },
                //         // { "$group": {
                //         //     "_id": "$exp_technology.technology_id",
                //         //     "expertiseyear": { "$year": "$exp_technology.exp_year" }
                //         // }}
                //       ],
                //       as: 'exp_technology',
                //     },
                //   },
                // 
                // { "$unwind": "$exp_technology" },
                // {
                //     "$lookup" : { 
                //         "from" : "technology_id", 
                //         "localField" : "exp_technology.technology_id",
                //         "foreignField" : "_id", 
                //         "as" : "exp_technology.technologes" 
                //     }
                // },
                // { "$unwind": "$exp_technology.technologes" },
                // {
                //     "$group": {
                //         "_id" : "$_id",   
                //         "technology_id": { "$push": "$exp_technology.technology_id" }            
                //     }
                // },
                // {
                //     "$project": {
                //         "exp_year": 1,
                //         "exp_technology.technology_id": "$technology_id"
                //     }
                // }
                     
                //   {
                //     $unwind:"$exp_technology"
                //   },
                //   {
                //     "$group":{
                //         "_id":"$_id",
                //         "exp_technology":{"$push":"$exp_technology"}
                //     }
                //   }
                // ]);
        }catch(err){
            return next(err)
        }
        res.status(200).json(document)
    }
    
}
export default userprofilecontroller