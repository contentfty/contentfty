/* eslint-disable no-undef,no-unused-expressions */
const isDev = think.env === 'development';
const nuxt = require('think-nuxt')

module.exports = [
  {
    handle: 'meta',
    options: {
      logRequest: isDev,
      sendResponseTime: isDev
    }
  },
  {
    handle: 'trace',
    enable: !think.isCli
  },
  {
    handle: 'payload',
    options: {}
  },
  {
    handle: nuxt,
    options: {
      unless: [/^\/api?/],
      isDev: isDev
    }
  }
  // 'logic',
  // 'controller'
]

