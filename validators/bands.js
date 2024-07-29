const Joi = require('joi');

module.exports = (band)=>{
    const schema  = Joi.object({
        name : Joi.string().min(3).max(255).required()
    });

    return schema.validate(band);
};