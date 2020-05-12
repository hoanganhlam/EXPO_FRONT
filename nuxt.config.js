require('dotenv').config()

export default {
    mode: 'universal',
    env: {
        PRIMARY_SITE_ID: process.env.PRIMARY_SITE_ID || 'vue',
        BASE_URL: process.env.BASE_URL || 'https://vuerepository.com',
        API_DOMAIN: process.env.API_DOMAIN || 'https://expo.bubblask.com'
    },
    /*
    ** Headers of the page
    */
    head: {
        title: process.env.npm_package_name || '',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: process.env.npm_package_description || ''}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
        ]
    },
    /*
    ** Customize the progress-bar color
    */
    loading: {color: '#fff'},
    /*
    ** Global CSS
    */
    css: [
        '@/style/app.sass',
    ],
    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        {src: '~/plugins/component'},
        {src: '~/plugins/repository'},
        {src: '~/plugins/generic'},
        {src: '~/plugins/front', mode: 'client'}
    ],
    /*
    ** Nuxt.js dev-modules
    */
    buildModules: [],
    /*
    ** Nuxt.js modules
    */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/pwa',
        // Doc: https://github.com/nuxt-community/dotenv-module
        '@nuxtjs/dotenv',
    ],
    /*
    ** Axios module configuration
    ** See https://axios.nuxtjs.org/options
    */
    axios: {
        baseURL: (process.env.API_DOMAIN ?  process.env.API_DOMAIN : 'https://expo.bubblask.com') + '/public'
    },
    /*
    ** Build configuration
    */
    build: {
        extractCSS: true,
        /*
        ** You can extend webpack config here
        */
        extend(config, ctx) {
        }
    }
}
