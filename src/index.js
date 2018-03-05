import Vue from 'vue'
import VueWeb3 from 'vue-web3'

import App from './App'
import router from './router'
import store from './store'
import websocket3 from './providers/websocket3'

Vue.use(VueWeb3, { web3: websocket3 })

import './index.scss'

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
