const Joi = require('joi');

const clientSchema = Joi.object({
  client_id: Joi.number().integer(),
  company_name: Joi.string().required(),
  contact_person: Joi.string().required(),
  email: Joi.string().email().required(),
  phone_number: Joi.string(),
  address: Joi.string(),
  citys: Joi.alternatives().try(Joi.string(), Joi.number().integer()),
  state: Joi.alternatives().try(Joi.string(), Joi.number().integer()),
  postal_code: Joi.alternatives().try(Joi.string(), Joi.number().integer()),
  country: Joi.alternatives().try(Joi.string(), Joi.number().integer()),
  username: Joi.string().required(),
  password: Joi.string().required(),
  // Add other fields related to clients
}).unknown(true);

module.exports = clientSchema;
