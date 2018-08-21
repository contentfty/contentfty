/* eslint-disable prefer-reflect,prefer-rest-params */
const {runHttpQuery} = require('apollo-server-core');
const jsonwebtoken = require('jsonwebtoken');
const { buildSchema } = require('../apollo/schema')

module.exports = {
  authFail () {
    return this.fail('JWT 验证失败');
  },

  checkAuth (target, name, descriptor) {
    const action = descriptor.value;
    descriptor.value = function () {
      console.log(this.ctx.state.user);
      const userName = this.ctx.state.user && this.ctx.state.user.name;
      if (!userName) {
        return this.authFail();
      }
      this.updateAuth(userName);
      return action.apply(this, arguments);
    }
    return descriptor;
  },

  updateAuth (userName) {
    const userInfo = {
      name: userName
    };
    const {secret, cookie, expire} = this.config('jwt');
    const token = jsonwebtoken.sign(userInfo, secret, {expiresIn: expire});
    this.cookie(cookie, token);
    return token;
  }
}
module.exports = (options = {}) => {

  return async ctx => {
    options.context = think.extend(options.context, {user: ctx.state.user})
    // const userName = options.context.state.user && options.context.state.user.name
    // if (!userName) {
    //   return this.fail('error')
    // }

    const readModel = []
    const getTypesNames = function (model) {
      return model.map(type => type.name)
    }
    const schema = await buildSchema()
    console.log('---------------------')
    console.log(schema)
    console.log('---------------------')
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
        console.log(ctx.body)
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
