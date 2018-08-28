const apiConfig = require('./api.config')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')

module.exports = {
  dev: process.env.NODE_ENV !== 'production',
  srcDir: 'client/',
  buildDir: '.build/',
  offline: true,
  // cache: {
  //   max: 100,
  //   maxAge: 1000 * 60 * 15
  // },
  /**
   * Using Phusion Passenger with Nginx on Plesk - That will gzip
   */
  performance: {
    gzip: false
  },
  router: {
    middleware: ['auth', 'change-page-layout'],
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
  ** Headers of the page
  */
  head: {
    title: '北京采撷科技',
    titleTemplate: '%s | 北京采撷科技',
    meta: [
      {charset: 'utf-8'},
      {'http-equiv': 'cleartype', content: 'on'},
      {name: 'author', content: 'hello@caixie.top'},
      {name: 'MobileOptimized', content: '320'},
      {name: 'HandheldFriendly', content: 'True'},
      {name: 'apple-mobile-web-app-capable', content: 'yes'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=no'},
      {hid: 'keywords', name: 'keywords', content: '小程序,建站'},
      {hid: 'description', name: 'description', content: '愿君多采撷！'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
    ],
    script: [
      {
        // async: 'async',
        // defer: 'defer',
        // type: 'text/javascript',
        // src: '/scripts/clmtrackr.js'
        // innerHTML: ``
      }
    ],
    // __dangerouslyDisableSanitizers: ['script'],
    noscript: [
      {innerHTML: 'This website requires JavaScript.'}
    ]
  },
  /*
  ** Customize the progress bar color
  */
  // loading: {color: '#FAFAFA'},
  loading: '~/components/loading',

  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, {isDev, isClient, isServer}) {
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
    extractCSS: true,
    filenames: {
      vendor: 'vendor.[hash:12].js',
      app: 'caixie.[chunkhash:12].js',
      css: 'caixie.[contenthash:12].css'
    },
    vendor: [
      'moment'
    ],
    plugins: [
      // new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(zh-cn)$/)
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh|en/)
    ]
  },
  babel: {
    presets: ['es2015', 'stage-2'],
    plugins: [
      'transform-async-to-generator',
      'transform-runtime'
    ],
    comments: true
  },
  modules: [
    // '@nuxtjs/component-cache',
    // ['@nuxtjs/component-cache', {maxAge: 1000 * 60 * 60}],
    '@nuxtjs/axios',
    '~/modules/auth',
    '@nuxtjs/apollo',
    // '@nuxtjs/proxy',
    // '@nuxtjs/auth',
    '@nuxtjs/toast'
  ],
  env: {
    // API_URL_BROWSER: apiConfig.baseURL,
    // browserBaseURL: apiConfig.baseURL,
    baseURL: apiConfig.baseURL,
    'socket': apiConfig.socketHost
  },
  // proxy: {
  //   '/api/'
  // },
  auth: {
    redirect: {
      login: '/login',
      home: '/posts'
    },
    watchLoggedIn: true,
    // redirect: {
    //   login: '/login'
    // },
    // token: {
    //   type: 'Bearer',
    //   name: 'token'
    // },
    endpoints: {
      // user: {
      //   method: 'get'
      // }
    },
    // fetchUserOnLogin: false
    // endpoints: {
    //   login: { url: '/api/auth/login', method: 'post', propertyName: 'token' },
    //   logout: { url: '/api/auth/logout', method: 'post' },
    //   user: { url: '/api/auth/user', method: 'get', propertyName: 'user'}
    // }
    // strategies: {
    //   local: {
    //     endpoints: {
    //       login: {propertyName: 'data.token'}
    //     }
    //   }
    // }
  },
  toast: {
    // position: 'top-right'
  },
  axios: {
    baseURL: apiConfig.baseURL
    // endpoints: {
    //   login: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    // }
    // credentials: false,
    // redirectError: {
    //   401: '/login'
    // },
    // requestInterceptor: (config, {store}) => {
    //   if (store.state.token) {
    //     config.headers.common.Authorization = 'Bearer ' + store.state.token
    //   }
    //   return config
    // }
  },
  apollo: {
    tokenName: 'yourApolloTokenName', // optional, default: apollo-token
    includeNodeModules: true, // optional, default: false (this includes graphql-tag for node_modules folder)
    authenticationType: 'Basic', // optional, default: 'Bearer'
    // required
    clientConfigs: {
      default: {
        // required
        httpEndpoint: 'http://localhost:4000',
        // You can use `wss` for secure connection (recommended in production)
        // Use `null` to disable subscriptions
        wsEndpoint: 'http://localhost:4000', // optional
        // LocalStorage token
        tokenName: 'apollo-token', // optional
        // Enable Automatic Query persisting with Apollo Engine
        persisting: false, // Optional
        // Use websockets for everything (no HTTP)
        // You need to pass a `wsEndpoint` for this to work
        websocketsOnly: false // Optional
      },
      test: {
        httpEndpoint: 'http://localhost:5000',
        wsEndpoint: 'http://localhost:5000',
        tokenName: 'apollo-token'
      },
      // alternative: user path to config which returns exact same config options
      test2: '~/plugins/my-alternative-apollo-config.js'
    }
  },
  plugins: [
    {src: '~plugins/route.js', ssr: false},
    {src: '~plugins/filters.js'},
    {src: '~/plugins/moment.js'},
    {src: '~/plugins/nuxt-client-init.js', ssr: false},
    {src: '~plugins/vee-validate.js'},
    {src: '~/plugins/vue-js-modal'},
    {src: '~plugins/axios.js'},
    {src: '~plugins/svgicon', ssr: false},
    {src: '~plugins/vue-infinite-scroll', ssr: false}
  ],
  css: [
    {src: '~assets/scss/main.scss', lang: 'scss'}
  ]
}
