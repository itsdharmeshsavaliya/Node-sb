import joi from 'joi';
import CustomErrorHandler from '../services/customErrorhandler';
const developertypesinfoschema = joi.object({
    icon:joi.string(),
    developertype:joi.string().required().error(CustomErrorHandler.unprocessedEntity("Please enter developertype")),
    description:joi.string().required().error(CustomErrorHandler.unprocessedEntity("Please enter description"))

})
export default developertypesinfoschema;