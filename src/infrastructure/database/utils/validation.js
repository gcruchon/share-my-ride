const Joi = require('joi');

module.exports = {
  isEmailValid: (email) => {
    const result = Joi.validate(email, Joi.string().email());
    return !result.error;
  }
};