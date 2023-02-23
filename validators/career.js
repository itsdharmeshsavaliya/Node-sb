import joi from 'joi';
// import CustomErrorHandler from '../services/customErrorhandler';

const careerschema = joi.object({
    // language_icon:joi.string().max(1).required().error(CustomErrorHandler.unprocessedEntity("Please enter language icon")),
    language_icon:joi.string().max(1).required().messages({
        "string.base":`"language icon" should be type of 'text'`,
        "string.max":`"language icon" should have a maximum length of {#limit}`,
        "any.required":`"language icon" is a required field`
    }), 
    title:joi.string().required().messages({
        "string.base":`"title" should be type of 'text'`,
        "any.required":`"title" is a required field`
    }),
    experience:joi.string().required().messages({
        "string.base":`"experience" should be type of 'text'`,
        "any.required":`"experience" is a required field`
    }),
    position:joi.number().required().messages({
        "number.base":`"position" should be type of 'number'`,
        "any.required":`"position" is a required field`
    }),
    status:joi.boolean().required().messages({
        "boolean.base":`"status" should be type of 'boolean'`,
        "any.required":`"status" is a required field`
    })
}).unknown();
export default careerschema;
