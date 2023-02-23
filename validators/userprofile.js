import joi from 'joi';
import joiObjectId from 'joi-objectid';
joi.objectId = joiObjectId(joi);
import CustomErrorHandler from '../services/customErrorhandler';

const technologyschema = joi.object({
    title:joi.string().required().error(CustomErrorHandler.unprocessedEntity("Please enter title")),
    logo:joi.string()
}).unknown()

const pmstoolsschema =joi.object({
    title:joi.string().required().error(CustomErrorHandler.unprocessedEntity("Please enter title")),
    logo:joi.string()
})

const hobbiesschema =joi.object({
    icon:joi.string(),
    hobbies:joi.string().required().error(CustomErrorHandler.unprocessedEntity("Please enter hobbies")),
})

const userprofileschema = joi.object({
    image:joi.string(),
    name:joi.string().required().error(CustomErrorHandler.unprocessedEntity("Please enter name")),
    skill:joi.string().required().error(CustomErrorHandler.unprocessedEntity("Please enter skill")),
    experience:joi.number().required().error(CustomErrorHandler.unprocessedEntity("Please enter experience")),
    communication_score:joi.number().required().error(CustomErrorHandler.unprocessedEntity("Please enter communication score")),
    technical_score:joi.number().required().error(CustomErrorHandler.unprocessedEntity("Please enter technical score")),


    expertise_section:joi.boolean().required().error(CustomErrorHandler.unprocessedEntity("expertise_section must be required")),
    exp_technology:joi.alternatives().conditional('expertise_section',{
        is:true,
        then:joi.array().items({technology_id:joi.objectId().required(),exp_year:joi.number().required()}).required().error(CustomErrorHandler.unprocessedEntity("Please select technology")),
        otherwise:joi.optional(),
    }),


    certification_section:joi.boolean().required().error(CustomErrorHandler.unprocessedEntity("certification_section must be required")),
    certi_about:joi.when('certification_section',{
        is:true,
        then:joi.string().required().error(CustomErrorHandler.unprocessedEntity("Please enter about you")),
        otherwise:joi.optional()
    }),
    certi_key_qualities:joi.when('certification_section',{
        is:true,
        then:joi.array().items(joi.string().required()).required().error(CustomErrorHandler.unprocessedEntity("Please enter key qualities")),
        otherwise:joi.optional()
    }),


    education_section:joi.boolean().required().error(CustomErrorHandler.unprocessedEntity("education_section must be required")),
    education:joi.alternatives().conditional('education_section',{
        is:true,
        then:joi.array().items({edu_year:joi.number().required(),edu_degree:joi.string().required(),edu_collage_name:joi.string().required()}).required().error(CustomErrorHandler.unprocessedEntity("Please enter education")),
        otherwise:joi.optional(),
    }),
    edu_professional_experience:joi.alternatives().conditional('education_section',{
        is:true,
        then:joi.string().required().error(CustomErrorHandler.unprocessedEntity("Please enter professional experience")),
        otherwise:joi.optional(),
    }),

    achievements_section:joi.boolean().required().error(CustomErrorHandler.unprocessedEntity("achievements_section must be required")),
    
    achievements_award:joi.alternatives().conditional('achievements_section',{
        is:true,
        then:joi.array().items({achi_award:joi.string().required(),achi_description:joi.string().required()}).required().error(CustomErrorHandler.unprocessedEntity("Please enter award")),
        otherwise:joi.optional(),
    }),
    achi_projects:joi.alternatives().conditional('achievements_section',{
        is:true,
        then:joi.string().required().error(CustomErrorHandler.unprocessedEntity("Please enter projects")),
        otherwise:joi.optional(),
    }),

    interests_section:joi.boolean().required().error(CustomErrorHandler.unprocessedEntity("interests_section must be required")),
    int_hobbies:joi.alternatives().conditional('interests_section',{
        is:true,
        then:joi.array().items(joi.objectId().required()).required().error(CustomErrorHandler.unprocessedEntity("Please enter hobbies")),
        otherwise:joi.optional(),
    }),
    int_technology:joi.alternatives().conditional('interests_section',{
        is:true,
        then:joi.array().items(joi.objectId().required()).required().error(CustomErrorHandler.unprocessedEntity("Please select technology")),
        otherwise:joi.optional(),
    }),
    int_pmstools:joi.alternatives().conditional('interests_section',{
        is:true,
        then:joi.array().items(joi.objectId().required()).required().error(CustomErrorHandler.unprocessedEntity("Please select pmstool")),
        otherwise:joi.optional(),
    }),

})
export  {technologyschema,pmstoolsschema,hobbiesschema,userprofileschema}