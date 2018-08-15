/* eslint-disable no-return-await */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
// const jwtStrategy = require('passport-jwt').ExtractJwt;
// const passport = require('koa-passport')
require('./auth')
const fetchUser = (() => {
  // This is an example! Use password hashing in your project and avoid storing passwords in your code
  const user = {id: 1, username: 'test', password: 'test'}
  return async function () {
    return user
  }
})()
module.exports = (options, ctx) => {
  return (ctx, next) => {
    // do something
    return passport.authenticate('local', function(err, user, info, status) {
      if (user === false) {
        ctx.body = {success: false}
        // ctx.throw(401)
        ctx.json('lll')
      } else {
        ctx.body = {success: true}
        // return ctx.login(user)
        ctx.json('lll')
      }
    })
  }
    // ctx.post(passport.authenticate('local', {
    //   successRedirect: '/app',
    //   failureRedirect: '/index'
    // }))
    // return ctx.json('lll')
  // passport.use(new LocalStrategy(
  //   async (username, password, done) =>  {
  //     const user = await think.model('users').where({
  //       user_login: username,
  //       user_pass: password
  //     }).find()
  //     if (!user) {
  //       return done(null, false, { message: 'Incorrect user.' });
  //     }
  //     return done(null, user);
  //   }
  // ))
  // }
}
