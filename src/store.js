import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import { contentLoaded } from 'document-promises'
import Web3 from 'web3'
import _ from 'lodash'

import websocket3 from './providers/websocket3'
import SpinnerContract from '../build/contracts/Spinner.json'

// import state from './state'
// import actions from './actions'
// import getters from './getters'
// import mutations from './mutations'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    web3: null,
    network: null,
    address: null,
    balance: null,
    throws: null
  },

  mutations: {
    web3(state, web3) {
      state.web3 = web3
    },

    network(state, network) {
      state.network = network
    },

    address(state, address) {
      state.address = address
    },

    balance(state, balance) {
      state.balance = balance
    },

    spinner(state, spinner) {
      state.spinner = spinner
    },
  },

  actions: {
    async registerWeb3({ commit, dispatch }) {
      await contentLoaded

      try {
        let web3 = new Web3(window.web3.currentProvider)
        commit('web3', web3)
      }
      catch (err) {
        commit('web3', false)
      }
    },

    async registerNetwork({ state, commit, dispatch }) {
      try {
        let network = await state.web3.eth.net.getId()
        commit('network', network)
      }
      catch (err) {
        commit('network', false)
      }
    },

    async registerAddress({ state, commit, dispatch }) {
      try {
        let accounts = await state.web3.eth.getAccounts()

        if (! accounts || ! accounts.length) throw 'No accounts'

        state.web3.eth.defaultAccount = accounts[0]
        commit('address', accounts[0])
      }
      catch (err) {
        commit('address', false)
      }
    },

    async registerBalance({ state, commit, dispatch }) {
      try {
        let balance = await state.web3.eth.getBalance(state.address)
        commit('balance', balance)
      }
      catch (err) {
        commit('balance', false)
      }
    },

    async registerSpinner({ state, commit, dispatch }) {
      let address = process.env.SPINNER || SpinnerContract.networks[state.network].address
      let spinner = new websocket3.eth.Contract(SpinnerContract.abi, address)

      commit('spinner', spinner)
    },
  },
})

export default store
