import joi from 'joi';
import CustomErrorHandler from '../services/customErrorhandler';

const futureschema = joi.object({
    years_of_experience:joi.number().required(),
    websites_delivered:joi.number().required(),
    countries_served:joi.number().required(),
    satisfied_clients:joi.number().required()
}).unknown()

export default futureschema;