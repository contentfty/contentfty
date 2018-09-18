/* eslint-disable prefer-reflect,prefer-rest-params */
const {runHttpQuery} = require('apollo-server-core');
const {buildSchema} = require('../apollo/schema')
const {makeExecutableSchema} = require('graphql-tools');

// const {typeDef: Auth, resolvers: authResolvers} = require('./auth')

module.exports = (options = {}) => {

  return async ctx => {
    // const spaceId = ctx.request.header['x-space-id']
    const spaceId = ctx.url.split('/')[3]
    // const schema = await buildSchema(spaceId)
    options.schema = await buildSchema(spaceId)
    // options.schema = buildSchema

    // 上下文配置
    options.context = think.extend(options.context, {
      user: ctx.state.user,
      spaceId: spaceId ? spaceId : ''
    })

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
