const Joi = require("joi");
module.exports.listingSchema = Joi.object({
  list: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().allow("", null),
    price: Joi.number().required().min(1),
    location: Joi.string().required(),
    country: Joi.string().required(),
    filters: Joi.array()
      .items(Joi.string().valid("room", "city", "mountain", "pool"))
      .default([]),
  }).required(),
});
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required(),
    comment: Joi.string().required(),
  }).required(),
});
