const apiConfig = require('./api.config')
const nodeExternals = require('webpack-node-externals')

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
    // middleware: ['auth'],
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
    extend (config, { isDev }) {
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      if (process.server) {
        config.externals = [
          nodeExternals({
            whitelist: [/\.(?!(?:js|json)$).{1,5}$/i, /^vue-awesome/, /^vue-upload-component/]
          })
        ]
      }
    },
    // postcss: [
    //   require('postcss-cssnext')({
    //     features: {
    //       customProperties: {
    //         warnings: false
    //       }
    //     }
    //   })
    // ],
    extractCSS: true
  },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/apollo'
    // '@nuxtjs/auth',
    // '@nuxtjs/toast',
  ],
  axios: {
    baseURL: apiConfig.baseURL
  },
  // auth: {
  //   strategies: {
  //     local: {
  //       endpoints: {
  //         login: { url: '/api/auth/login', method: 'post', propertyName: 'data.token' },
          // logout: { url: '/api/auth/logout', method: 'post' },
          // user: { url: '/api/auth/user', method: 'get', propertyName: 'user' }
        // },
        // tokenRequired: true,
        // tokenType: 'bearer',
      // }
    // }
  // },
  // Give apollo module options
  apollo: {
    // tokenName: 'yourApolloTokenName', // optional, default: apollo-token
    tokenExpires: 10, // optional, default: 7
    includeNodeModules: true, // optional, default: false (this includes graphql-tag for node_modules folder)
    // authenticationType: 'Basic', // optional, default: 'Bearer'
    // optional
    errorHandler (error) {
      console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message)
    },
    // required
    clientConfigs: {
      default: {
        // required
        httpEndpoint: 'http://localhost:5000',
        // optional
        // See https://www.apollographql.com/docs/link/links/http.html#options
        httpLinkOptions: {
          credentials: 'same-origin'
        },
        // You can use `wss` for secure connection (recommended in production)
        // Use `null` to disable subscriptions
        // wsEndpoint: 'ws://localhost:5000', // optional
        // LocalStorage token
        tokenName: 'apollo-token', // optional
        // Enable Automatic Query persisting with Apollo Engine
        persisting: false, // Optional
        // Use websockets for everything (no HTTP)
        // You need to pass a `wsEndpoint` for this to work
        websocketsOnly: false // Optional
      },
      // test: {
      //   httpEndpoint: 'http://localhost:5000',
      //   wsEndpoint: 'ws://localhost:5000',
      //   tokenName: 'apollo-token'
      // },
      // alternative: user path to config which returns exact same config options
      // test2: '~/plugins/my-alternative-apollo-config.js'
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

