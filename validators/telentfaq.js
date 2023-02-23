import joi from 'joi';
// import CustomErrorHandler from '../services/customErrorhandler';

const telentfaqschema = joi.object({
    title:joi.string().required(),
    description:joi.string().required()
}).unknown()
export default telentfaqschema;