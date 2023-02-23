import joi from 'joi';
import CustomErrorHandler from '../services/customErrorhandler';
const clientschema = joi.object({
    name:joi.string().required().error(CustomErrorHandler.unprocessedEntity("Please enter name")),
    city:joi.string().required().error(CustomErrorHandler.unprocessedEntity("please select city")),
    description:joi.string().required().error(CustomErrorHandler.unprocessedEntity("Please enter description")),
    image:joi.string()
})
export default clientschema