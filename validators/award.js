import joi from 'joi';

const awardschema = joi.object({
    image:joi.string()
})
export default awardschema;