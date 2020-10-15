// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import { BootstrapVue, BIconLockFill, BootstrapVueIcons } from 'bootstrap-vue'
import { store } from './store/'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
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