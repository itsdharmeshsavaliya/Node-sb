import joi from 'joi';
import joiObjectId from "joi-objectid";
joi.objectId = joiObjectId(joi);

const careerapply = joi.object({
    file:joi.string(),
    // applying:joi.objectId().required(),
    applyingname:joi.string().required(),
    name:joi.string().required(),
    mobile_no:joi.string().length(10).pattern(/^[0-9]+$/).required(),
    email:joi.string().email().required(),
    status:joi.string().required(),
    noticeperiod:joi.string().required(),
    description:joi.string()
})
export default careerapply;