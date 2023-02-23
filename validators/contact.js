import joi from 'joi';

const contact = joi.object({
    services:joi.string().required(),
    name:joi.string().required(),
    mobile_no:joi.string().length(10).pattern(/^[0-9]+$/).required(),
    email:joi.string().email().required(),
    country:joi.string().required(),
    city:joi.string().required(),
    address:joi.string().required(),
    description:joi.string().required()
})
export default contact;