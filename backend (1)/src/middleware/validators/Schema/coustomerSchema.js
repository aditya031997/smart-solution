const Joi = require('joi');

const customerValidator = Joi.object().keys({
  company_name: Joi.string().required(),
  contact_person: Joi.string().required(),
  email: Joi.string().email().required(),
  phone_number: Joi.number(),
  address: Joi.string(),
  citys: Joi.alternatives().try(Joi.string(), Joi.number().integer()),
  state: Joi.alternatives().try(Joi.string(), Joi.number().integer()),
  postal_code: Joi.number(),
  country: Joi.alternatives().try(Joi.string(), Joi.number().integer()),
  username: Joi.string().required(),
  password: Joi.string().required(),
  credit_limit: Joi.number().min(0).required(),
  // No need to validate balance as it's a default value in the schema
}).unknown(true);

module.exports = customerValidator;
