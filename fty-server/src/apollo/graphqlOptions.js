const { Stream } = require('stream')
const Joi = require('joi')
const {
  Source,
  parse,
  validate,
  execute,
  formatError,
  getOperationAST,
  specifiedRules
} = require('graphql')
const {version} = require('../../package')

/**
 * Define constants
 * @type {{}}
 */
const optionsSchema = {
  query: [
    Joi.func(),
    Joi.object({
      schemaFunc: Joi.func().required(),
      context: Joi.object(),
      rootValue: Joi.boolean(),
      // Graphiql: Joi.boolean(),
      formatError: Joi.func(),
      validationRules: Joi.array()
    }).required()
  ],
  route: Joi.object()
    .keys({
      path: Joi.string().required(),
      config: Joi.object()
    })
    .require()
}
