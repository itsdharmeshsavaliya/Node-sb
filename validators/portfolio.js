import joi from 'joi';
import joiObjectId from "joi-objectid";
import CustomErrorHandler from '../services/customErrorhandler';
joi.objectId = joiObjectId(joi);

const portfoliocategoryschema = joi.object({
  categoryname:joi.string().required().error(CustomErrorHandler.unprocessedEntity("Please enter category name"))  
})

const portfolioschema = joi.object({
    category:joi.objectId().required().error(CustomErrorHandler.unprocessedEntity("Please select Category")),
    websitename:joi.string().required().error(CustomErrorHandler.unprocessedEntity("Please enter website name")),
    websitelink:joi.string().required().error(CustomErrorHandler.unprocessedEntity("Please enter website link")),
    websitelanguage:joi.string().required().error(CustomErrorHandler.unprocessedEntity("Please enter website language")),
    image:joi.string()
})

export { portfolioschema , portfoliocategoryschema }