// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import cookie from 'js-cookie'

import lodash from 'lodash'
import VueLodash from 'vue-lodash'

export const bus = new Vue()

Vue.config.productionTip = false
Vue.use(VueLodash, lodash)
Vue.prototype.$axios = axios
Vue.prototype.$cookie = cookie

// 아래를 붙임으로 익스플로러에서 axios가 사용 가능해짐
require('es6-promise').polyfill()
require('./assets/css/reset.css')
require('./assets/css/common.css')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
