// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import { store } from './store/'

Vue.use(BootstrapVue)

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
//import 'bootstrap/dist/js/bootstrap.bundle.min.js'

Vue.config.productionTip = false

/* eslint-disable no-new */
var topVue = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  data : {
    loggedIn: 'from main.js data:loggedIn prop'
  }
})