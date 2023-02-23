import joi from "joi";
import CustomErrorHandler from "../services/customErrorhandler";

const servicesschema = joi.object({
    name:joi.string().required().error(CustomErrorHandler.unprocessedEntity("Please enter name")),
    types:joi.array().required().items({title:joi.string().required(),link:joi.string().required()}).error(CustomErrorHandler.unprocessedEntity("Please enter types")),
    description:joi.string().required().error(CustomErrorHandler.unprocessedEntity("Please enter description")),
    image:joi.string()
})
export default servicesschema;