import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home'
import Spinner from './pages/Spinner'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/spinner',
      name: 'Spinner',
      component: Spinner
    },
  ]
})
