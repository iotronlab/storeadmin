import colors from 'vuetify/es5/util/colors'

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'spa',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
  },
  /*
   ** Global CSS
   */
  css: ['~/assets/main.css'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    {
      src: '~/plugins/vee-validate.js',
    },
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    '@nuxtjs/vuetify',
    // '@nuxtjs/proxy',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt/content
    '@nuxt/content',
    '@nuxtjs/toast',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: 'http://localhost:8000/api',
    //baseURL: 'http://api.butiq.store/api',
    // proxy: true,
  },

  // auth module config
  auth: {
    redirect: {
      home: '/',
      logout: '/',
      login: '/',
      callback: '/',
    },
    localStorage: {
      prefix: 'artifycp.',
    },
    strategies: {
      local: {
        token: {
          property: 'accessToken',
          required: true,
          type: 'Bearer',
          prefix: '_vendor.',
          maxAge: false,
        },
        user: {
          property: 'data',
          autoFetch: true,
        },
        endpoints: {
          login: {
            url: '/vendor/login',
            method: 'post',
          },
          user: {
            url: '/vendor/details',
            method: 'get',
          },
          logout: {
            url: '/vendor/logout',
            method: 'get',
          },
        },

        watchLoggedIn: true,
      },
    },
  },
  //toast notifications
  toast: {
    position: 'top-center',
    duration: 4000,
    theme: 'bubble',
    action: {
      text: 'Close',
      onClick: (e, toastObject) => {
        toastObject.goAway(0)
      },
    },
    register: [
      // Register custom toasts
      {
        name: 'my-error',
        message: 'Oops...Something went wrong',
        options: {
          type: 'error',
        },
      },
    ],
  },
  //global auth middleware
  router: {
    //middleware: ['auth'],
  },
  /*
   ** Changing base url to target url using proxy
   */

  // proxy: {
  //   '/test': { target: 'https://www.google.co.in/', pathRewrite: {'^/test': ''} }
  // },

  /*
   ** Content module configuration
   ** See https://content.nuxtjs.org/configuration
   */
  content: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: '#7851a9',
          accent: '#daa520',
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent4,
        },
      },
    },
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
}
