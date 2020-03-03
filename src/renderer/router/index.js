import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@../../../code/mainwin/home/home').default
    },
    {
      path: '/popWindow',
      name: 'popWindow',
      component: require('@../../../code/popwin/home').default
    },
    {
      path: '/taskWindow',
      name: 'taskWindow',
      component: require('@../../../code/taskwin/home').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
