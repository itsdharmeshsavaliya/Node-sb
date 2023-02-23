import joi from 'joi';
import CustomErrorHandler from '../services/customErrorhandler';

const serviceschema = joi.object({
    title:joi.string().required().error(CustomErrorHandler.unprocessedEntity("Please enter title")),
    image:joi.string()
})

export default serviceschema
