const Joi = require('joi');

// Define the validation schema
const albumSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(255)
    .required(),
  release_year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required()
    .messages,
  band_id: Joi.number()
    .integer()
    .min(1)
    .required()
});

const validate = (album) => {
  return albumSchema.validate(album);
};

module.exports = validate;
