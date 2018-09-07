const apiConfig = require('./api.config')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')

module.exports = {
  dev: process.env.NODE_ENV !== 'production',
  srcDir: 'client',
  buildDir: '.build',
  /*
  ** Headers of the page
  */
  head: {
    title: 'fty-backoffice',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Backoffice' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  // loading: { color: '#3B8070' },
  loading: '~/components/loading',

  router: {
    middleware: ['auth'],
    linkActiveClass: 'selected is-active',
    linkExactActiveClass: 'is-selected',
    scrollBehavior (to, from, savedPosition) {
      return {
        x: 0,
        y: 0
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient, isServer }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      if (isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/\.(?!(?:js|json)$).{1,5}$/i, /^vue-awesome/, /^vue-upload-component/]
          })
        ]
      }
    },
    postcss: [
      require('postcss-cssnext')({
        features: {
          customProperties: {
            warnings: false
          }
        }
      })
    ],
    extractCSS: true
  },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/toast',
  ],
  axios: {
    baseURL: apiConfig.baseURL
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/api/auth/login', method: 'post', propertyName: 'data.token' },
          // logout: { url: '/api/auth/logout', method: 'post' },
          // user: { url: '/api/auth/user', method: 'get', propertyName: 'user' }
        },
        // tokenRequired: true,
        // tokenType: 'bearer',
      }
    }
  },
  plugins: [
    {src: '~plugins/vee-validate.js'},
    // {src: '~plugins/axios.js'},
    {src: '~plugins/svgicon', ssr: false}
  ],
  css: [
    {src: '~assets/scss/main.scss', lang: 'scss'}
  ]
}

