const path = require('path');
const cors = require('@koa/cors')

const isDev = think.env === 'development';
const graphql = require('../apollo');
// const { makeExecutableSchema } = require('graphql-tools');
const Schema = require('../graphql/schema');
// const Resolvers = require('../graphql/resolvers');
// const Connectors = require('../graphql/connectors');
// const passport = require('../passport')
const passport = require('koa-passport');
const LocalStrategy = require('passport-local').Strategy

const jwt = require('koa-jwt')

module.exports = [
  {
    handle: 'meta',
    options: {
      logRequest: isDev,
      sendResponseTime: isDev
    }
  },
  {
    handle: 'resource',
    enable: isDev,
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(static|favicon\.ico)/
    }
  },
  {
    handle: 'trace',
    enable: !think.isCli,
    options: {
      debug: isDev
    }
  },
  {
    handle: 'payload',
    options: {
      keepExtensions: true,
      limit: '5mb'
    }
  },
  {
    handle: (option, app) => {
      return (ctx, next) => {
        return next().catch((err) => {
          // eslint-disable-next-line yoda
          if (401 === err.status) {
            ctx.status = 401;
            ctx.body = 'Protected resource, use Authorization header to get access\n';
          } else {
            ctx.body = 'Protected resource, use Authorization header to get access\n';
            throw err;
          }
        });
      };
    }
  },
  {
    handle: cors,
    options: {}
  },

  {
    handle: jwt,
    options: {
      cookie: think.config('jwt').cookie,
      secret: think.config('jwt').secret
      // 即使没有找到认证头,你也可以通过添加一个passthrough选项来保证始终传递到下一个(中间件)
      // passthrough: true
      // secret: 'S1BNbRp2b'
    },
    match: ctx => { // match 为一个函数，将 ctx 传递给这个函数，如果返回结果为 true，则启用该 middleware
      console.log(ctx.url)
      if (ctx.url.match(ctx.url.match(/^\/api\/v1\/account\/signup?/) ||
        ctx.url.match(/^\/api\/v1\/account\/signin?/) ||
        ctx.url.match(/^\/api\/auth\/login?/))) {
        return false;
      } else if (ctx.url.match(ctx.url.match(/^\/graphql*?/) || ctx.url.match(/^\/api*?/))) {
        return true
      }
    }
  },

  {
    handle: 'router',
    options: {}
  },
  {
    match: '/graphql',
    handle: graphql,
    options: {
      schema: Schema
    }
  },

  'logic',
  'controller'
];
