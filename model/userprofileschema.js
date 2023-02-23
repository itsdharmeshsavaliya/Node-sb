import mongoose from "mongoose";
import { APP_URL } from "../config";

const technologyschema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    logo:{
        type:String,
        required:true,
        get:(image)=>{
            return (image) ? `${APP_URL}/uploads/technology/${image}`:'';
        }
    }
},{timestamps:true,toJSON:{getters:true},id:false}) 

const technology = mongoose.model('technology',technologyschema,'technology');

const pmstoolsschema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    logo:{
        type:String,
        required:true,
        get:(image)=>{
            return (image) ? `${APP_URL}/uploads/pmstools/${image}`:'';
        }
    }
},{timestamps:true,toJSON:{getters:true},id:false})
const pmstools = mongoose.model('pmstools',pmstoolsschema,'pmstools');

const exp_technologyschema = new mongoose.Schema({
    technology_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'technology',
        required:true
    },
    exp_year:{
        type:Number,
        required:true
    }
},{_id:false})

const hobbiesschema = new mongoose.Schema({
    icon:{
        type:String,
        required:true,
        get:(image)=>{
            return (image) ? `${APP_URL}/uploads/hobbies/${image}`:'';
        }
    },
    hobbies:{
        type:String,
        required:true
    }
},{timestamps:true,toJSON:{getters:true},id:false})
const hobbies = mongoose.model('hobbies',hobbiesschema,'hobbies');

const userprofileschema = new mongoose.Schema({
    image:{
        type:String,
        get:(image)=>{
            return (image) ? `${APP_URL}/uploads/userprofile/${image}`:'';
        }
    },
    name:{
        type:String,
        required:true
    },
    skill:{
        type:String,
        required:true
    },
    experience:{
        type:Number,
        required:true
    },
    communication_score:{
        type:Number,
        required:true
    },
    technical_score:{
        type:Number,
        required:true
    },
    
    expertise_section:{
        type:Boolean,
        default:false
    },
    exp_technology:[exp_technologyschema],

    certification_section:{
        type:Boolean,
        default:false
    },
    certi_about:{
        type:String
    },
    certi_key_qualities:{
        type:[]
    },

    education_section:{
        type:Boolean,
        default:false
    },

    education:[{
        edu_year:{
            type:Number
        },
        edu_degree:{
            type:String
        },
        edu_collage_name:{
            type:String
        }
    }],

    edu_professional_experience:{
        type:String
    },

    achievements_section:{
        type:Boolean,
        default:false
    },
    achievements_award:[{
        achi_award:{
            type:String
        },
        achi_description:{
            type:String
        }
    }],
    achi_projects:{
        type:String
    },

    interests_section:{
        type:Boolean,
        default:false
    },
    int_hobbies:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'hobbies'
    }],
    int_technology:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'technology'
    }],
    int_pmstools:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'pmstools'
    }]

},{timestamps:true,toJSON:{getters:true},id:false})

const userprofile = mongoose.model('userprofile',userprofileschema,'userprofile');

export default {
    technology,
    pmstools,
    hobbies,
    userprofile
}