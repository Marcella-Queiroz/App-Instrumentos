import Joi from "joi";

export const listingCreateSchema = Joi.object({
  title: Joi.string().min(3).max(120).required(),
  description: Joi.string().allow("", null),
  price: Joi.number().positive().required(),
  acceptsTrade: Joi.boolean().default(false),
  condition: Joi.string().valid("novo","semi-novo","usado").required(),
  category: Joi.string().required(),
  city: Joi.string().allow("", null),
  photos: Joi.array().items(Joi.string().uri()).default([]) // URLs por enquanto
});

export const listingStatusSchema = Joi.object({
  status: Joi.string().valid("active","paused","sold").required()
});
