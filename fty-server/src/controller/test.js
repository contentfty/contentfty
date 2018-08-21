const Base = require('./base.js');
// const LocalStrategy = require('passport-local').Strategy
// require('../passport/auth')

// const koapassport = require('koa-passport')

const passport = require('passport');

module.exports = class extends Base {
   async indexAction () {

     // return this.success('lala')
     passport.authenticate('local', {
       successRedirect: '/app',
       failureRedirect: '/index'
     })
     // return this.success('lala')
  }

  loginAction () {
    return this.success('login')
  }

  postAction () {
    return this.success('login')
  }
};
