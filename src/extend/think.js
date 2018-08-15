const lodash = require("lodash");
const path = require('path');
const shortId = require('shortid')
// const nanoId = require('nanoid')
const nanoGenerate = require('nanoid/generate')
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const shortAlphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
const tc = require('./textcensor')
const qetag = require('./qetag')
// const Redis = require('ioredis')
// const isDev = think.env === 'development'
const preventMessage = 'PREVENT_NEXT_PROCESS'
// let elementType = Symbol()
// let
const elementType = {
  user: 'user',
  space: 'space',
  env: 'env',
  org: 'org'
  // user: Symbol('user'),
  // space: Symbol('space'),
  // env: Symbol('env'),
  // org: Symbol('org')
}
module.exports = {
  // prevent () {
  //   throw new Error(preventMessage)
  // },
  // isPrevent(err) {
  //   return think.isError(err) && err.message === preventMessage
  // },
  _: lodash,
  tc: tc,
  generate: {
    id: () => {
      return nanoGenerate(alphabet, 21)
    },
    spaceId: () => {
      return nanoGenerate(shortAlphabet, 12)
    }
  },
  elementType: elementType,
  shortId: shortId,
  etag: qetag,
  resource: path.join(think.ROOT_PATH, 'www')
}
