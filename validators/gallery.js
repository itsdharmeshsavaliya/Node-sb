import joi, { array } from 'joi';

const galleryschema = joi.object({
    image:joi.string()
})
export default galleryschema