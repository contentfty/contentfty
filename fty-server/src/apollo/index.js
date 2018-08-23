/* eslint-disable prefer-reflect,prefer-rest-params */
const {runHttpQuery} = require('apollo-server-core');
const jsonwebtoken = require('jsonwebtoken');
const { buildSchema } = require('../apollo/schema')

module.exports = (options = {}) => {

  return async ctx => {
    options.context = think.extend(options.context, {user: ctx.state.user})
    // const userName = options.context.state.user && options.context.state.user.name
    // if (!userName) {
    //   return this.fail('error')
    // }

    // const readModel = []
    // const getTypesNames = function (model) {
    //   return model.map(type => type.name)
    // }
    // console.log(options.schema)
    const schema = await buildSchema()
    // console.log('---------------------')
    // console.log('---------------------')
    options.schema = schema
    // console.log(options.schema)
    return runHttpQuery([], {
      method: ctx.request.method,
      options,
      query:
        ctx.request.method === 'POST'
          ? ctx.post()
          : ctx.param()
    }).then(
      rsp => {
        ctx.set('Content-Type', 'application/json');
        ctx.body = rsp;
        // console.log(ctx.body)
      },
      err => {
        if (err.name !== 'HttpQueryError') {
          throw err;
        }

        err.headers &&
        Object.keys(err.headers).forEach(header => {
          ctx.set(header, err.headers[header]);
        });

        ctx.status = err.statusCode;
        ctx.body = err.message;
      }
    );
  };
};
