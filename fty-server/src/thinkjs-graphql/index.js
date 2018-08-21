const {Stream} = require('stream')
import Boom from 'boom'

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
 */
const optionsSchema = {
  query: [
    Joi.func(),
    Joi.object({
      schemaFunc: Joi.func().required(),
      context: Joi.object(),
      rootValue: Joi.object(),
      pretty: Joi.boolean(),
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
    .required()
}

/**
 * Define helper: get options from object/function
 */
const getOptions = async (options, request) => {
  // Get options
  const optionsData = await Promise.resolve(
    typeof options === 'function' ? options(request) : options
  );

  // Validate options
  const validation = Joi.validate(optionsData, optionsSchema.query);
  if (validation.error) {
    throw validation.error;
  }
  return validation.value;
}

/**
 * Define helper: parse payload
 */
const parsePayload = async request => {
  // Read stream
  const result = await new Promise(resolve => {
    if (request.payload instanceof Stream) {
      let data = '';
      request.payload.on('data', chunk => {
        data += chunk;
      });
      request.payload.on('end', () => resolve(data));
    } else {
      resolve('{}');
    }
  })

  // Return normalized payload
  let formattedResult = null;
  if (request.mime === 'application/graphql') {
    formattedResult = {query: result};
  } else {
    formattedResult = JSON.parse(result);
  }
  return formattedResult;
}

/**
 * Define helper: get GraphQL parameters from query/payload
 */
const getGraphQLParams = (request, payload = {}) => {
  // GraphQL Query string.
  const query = request.query.query || payload.query;

  // Parse the variables if needed.
  let variables = request.query.variables || payload.variables;
  if (variables && typeof variables === 'string') {
    try {
      variables = JSON.parse(variables);
    } catch (error) {
      throw Boom.badRequest('Variables are invalid JSON.');
    }
  }

  // Name of GraphQL operation to execute.
  const operationName = request.query.operationName || payload.operationName;

  // Return params
  return {query, variables, operationName};
}

const createResult = async ({
                              context,
                              operationName,
                              query,
                              request,
                              rootValue,
                              schemaFunc,
                              showGraphiQL,
                              validationRules,
                              variables
                            }) => {
  // If there is no query, but GraphiQL will be displayed, do not produced
  // a result, otherwise return a 400: Bad Request.
  // const schema
  if (!query) {
    if (showGraphiQL) {
      return null
    }
    throw Boom.badRequest('Must provide query string.')
  }
  // GraphQL source.
  const source = new Source(query, 'GraphQL request')

  // Parse source to AST, reporting any syntax error.
  let documentAST
  try {
    documentAST = parse(source)
  } catch (syntaxError) {
    // Return 400: Bad Request if any syntax errors errors exist.
    throw Boom.badRequest('Syntax error', [syntaxError])
  }

  // Validate AST, reporting any errors.
  const validationErrors = validate(schemaFunc, documentAST, validationRules)
  if (validationErrors.length > 0) {
    // Return 400: Bad Request if any validation errors exist.
    throw Boom.badRequest('Validation error', validationErrors)
  }

  // Only query operations are allowed on GET requests.
  if (request.method === 'get') {
    // Determine if this GET request will perform a non-query.
    const operationAST = getOperationAST(documentAST, operationName)
    if (operationAST && operationAST.operation !== 'query') {
      // If GraphiQL can be shown. do not perform this query, but
      // provide it to GraphiQL so that the requester may perform it
      // themselves if desired.
      if (showGraphiQL) {
        return null
      }

      // Otherwise, report a 405: Method Not Allowed error.
      throw Boom.methodNotAllowed(
        `Can only perform a ${operationAST.operation} operation from a POST request.`
      )
    }
  }

  // Perform the execution, reporting any errors creating the context.
  let result
  try {
    result = await execute(schemaFunc, documentAST, rootValue, context, variables, operationName)
  } catch (contextError) {
    // Return 400: Bad Request if any execution context errors exist.
    throw Boom.badRequest('Context error', [contextError])
  }
  if (result.errors) {
    const code = selectStatusCode(result.errors)
    switch (code) {
      case 409:
        throw Boom.conflict('Conflict error', result.errors)
      default:
        throw Boom.badRequest('Bad request', result.errors)
    }
  }
  return result
}

const selectStatusCode = function (errors) {
  const priorities = [409, 404, 400, 500, 512, 408, 440]
  // https://github.com/graphql/graphql-js/issues/251y
  const codes = []
  for (const error of errors) {
    codes.push(JSON.parse(JSON.stringify(error.originalError)).code)
  }
  codes.sort((code1, code2) => priorities.indexOf(code1) - priorities.indexOf(code2))
  return codes[0]
}

module.exports = (options = {}) => {

  return async ctx => {
    const request = ctx.request
    let errorFormatter = formatError
    options.context = think.extend(options.context, {user: ctx.state.user})
    // Get GraphQL options given this request.
    const {
      schemaFunc,
      context,
      rootValue,
      pretty,
      formatError: customFormatError,
      validationRules: additionalValidationRules
    } = await getOptions(options, request)

    let validationRules = specifiedRules
    if (additionalValidationRules) {
      validationRules = validationRules.concat(additionalValidationRules)
    }
    // GraphQL HTTP only supports GEt and POST methods.
    if (request.method !== 'get' && request.method !== 'post') {
      throw Boom.methodNotAllowed('GraphQL only supports GET and POST requests.')
    }

    // Parse payload
    const payload = await parsePayload(request)
    const {query, variables, operationName} = getGraphQLParams(request, payload)

    // Create the result
    const result = await createResult({
      context,
      operationName,
      query,
      request,
      rootValue,
      schemaFunc,
      // ShowGraphiQL,
      validationRules,
      variables
    })

    // Format any encountered errors.
    if (result && result.errors) {
      result.errors = request.errors.map(errorFormatter)
    }

    // If allowed to show GraphiQL, present it instead of JSON.
    // If allowed to show GraphiQL, present it instead of JSON.
    // if (showGraphiQL) {
    // reply(renderGraphiQL({ query, variables, operationName, result })).type('text/html');
    // } else {
    // Otherwise, present JSON directly.
    reply(JSON.stringify(result, null, pretty ? 2 : 0)).type('application/json');

    // const userName = options.context.state.user && options.context.state.user.name
    // if (!userName) {
    //   return this.fail('error')
    // }
    // return runHttpQuery([], {
    //   method: ctx.request.method,
    //   options,
    //   query:
    //     ctx.request.method === 'POST'
    //       ? ctx.post()
    //       : ctx.param()
    // }).then(
    //   rsp => {
    //     ctx.set('Content-Type', 'application/json');
    //     ctx.body = rsp;
    //   },
    //   err => {
    //     if (err.name !== 'HttpQueryError') {
    //       throw err;
    //     }
    //
    //     err.headers &&
    //     Object.keys(err.headers).forEach(header => {
    //       ctx.set(header, err.headers[header]);
    //     });
    //
    //     ctx.status = err.statusCode;
    //     ctx.body = err.message;
    //   }
    // );
  }
}

