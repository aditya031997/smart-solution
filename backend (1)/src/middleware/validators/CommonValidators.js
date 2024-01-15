const Joi = require("joi");

const CommonValidator = (data, CompanySchema) => {
  try {
    Joi.assert(data, CompanySchema, { abortEarly: false });
    return { validate: true };
  } catch (error) {
    let validationError = Object.keys(error._original);
    let errorObj = {};
    for (let i = 0; i < error.details.length; i++) {
        let key = error.details[i].message.replace(/["\\]/g,"").split(' ')
    //   errorObj[validationError[i]] = error.details[i].message.replace(/["\\]/g,"").split(' ')
      errorObj[key[0]] = error.details[i].message.replace(/["\\]/g,"")    
    }
    return { validate: false, data: errorObj };
  }
};
module.exports = CommonValidator;
