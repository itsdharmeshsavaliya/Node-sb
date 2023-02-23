import joi from 'joi';

const bannerschema = joi.object({
    image:joi.string()
})

export default bannerschema;