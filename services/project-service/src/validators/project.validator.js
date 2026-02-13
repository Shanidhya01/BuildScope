const Joi = require("joi");

const createProjectSchema = Joi.object({
  idea: Joi.string().min(5).required(),
  blueprint: Joi.object().required()
});

module.exports = {
  createProjectSchema
};
