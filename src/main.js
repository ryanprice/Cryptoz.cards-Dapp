// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueGtm from 'vue-gtm'
import router from './router'
import { BootstrapVue, BIconLockFill, BootstrapVueIcons } from 'bootstrap-vue'
import Clipboard from 'v-clipboard'
import { store } from './store/'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(Clipboard)
Vue.use(VueGtm, {
  id: 'GTM-XXXXXXX', // Your GTM single container ID or array of container ids ['GTM-xxxxxx', 'GTM-yyyyyy']
/*
queryParams: { // Add url query string when load gtm.js with GTM ID (optional)
    gtm_auth:'AB7cDEf3GHIjkl-MnOP8qr',
    gtm_preview:'env-4',
    gtm_cookies_win:'x'
  },
*/
  defer: false, // defaults to false. Script can be set to `defer` to increase page-load-time at the cost of less accurate results (in case visitor leaves before script is loaded, which is unlikely but possible)
  enabled: true, // defaults to true. Plugin can be disabled by setting this to false for Ex: enabled: !!GDPR_Cookie (optional)
  debug: true, // Whether or not display console logs debugs (optional)
  loadScript: true, // Whether or not to load the GTM Script (Helpful if you are including GTM manually, but need the dataLayer functionality in your components) (optional)
  vueRouter: router, // Pass the router instance to automatically sync with router (optional)
  ignoredViews: ['homepage'], // Don't trigger events for specified router names (case insensitive) (optional)
  trackOnNextTick: false, // Whether or not call trackView in Vue.nextTick
});
Vue.component('BIconLockFill', BIconLockFill)


import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
var topVue = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  data : {
    loggedIn: 'from main.js data:loggedIn prop'
  }
})