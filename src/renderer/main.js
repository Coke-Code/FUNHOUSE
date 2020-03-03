import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import VueI18n from 'vue-i18n'
import LanguageEn from '../../static/language/en'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'en',
  messages: {
    'en': LanguageEn
  }
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  i18n,
  router,
  template: '<App/>'
}).$mount('#app')
