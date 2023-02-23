import joi from 'joi';
// import CustomErrorHandler from '../services/customErrorhandler';

const careerform = joi.object({
    category:joi.string().required().messages({
        "string.base":`"category" should be type of 'text'`,
        "any.required":`"category" is a required field`
    }),
    points:joi.array().items(joi.string().required()).required().messages({
        "string.base":`"points" should be type of 'text'`,
        "any.required":`"points" is a required field`
    })
}).unknown();
export default careerform