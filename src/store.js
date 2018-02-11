import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'
import { contentLoaded } from 'document-promises'
import Web3 from 'web3'

// import state from './state'
// import actions from './actions'
// import getters from './getters'
// import mutations from './mutations'

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.localStorage,
  reducer: state => ({ user: state.user })
})

const store = new Vuex.Store({
  state: {
    web3: null,
    network: null,
    accounts: null,
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

    accounts(state, accounts) {
      state.accounts = accounts
    },

    balance(state, balance) {
      state.balance = balance
    },

    throws(state, throws) {
      state.throws = throws
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

    async registerAccounts({ state, commit, dispatch }) {
      try {
        let accounts = await state.web3.eth.getAccounts()

        if (! accounts || ! accounts.length) throw 'No accounts'

        commit('accounts', accounts)
      }
      catch (err) {
        commit('accounts', false)
      }
    },

    async registerBalance({ state, commit, dispatch }) {
      try {
        let balance = await state.web3.eth.getBalance(state.accounts[0])
        commit('balance', balance)
      }
      catch (err) {
        commit('balance', false)
      }
    },

    async registerThrows({ state, commit, dispatch }) {
      try {
        var abi = [{"constant":true,"inputs":[],"name":"getgreeting","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_msg","type":"bytes32"}],"name":"greet","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_greeting","type":"bytes32"}],"name":"Event1","type":"event"}]
        var contract = new state.web3.eth.Contract(abi, process.env.SPINNER);

        let events = await contract.getPastEvents('Event1', {
          fromBlock: 0,
          toBlock: 'latest'
        })

        console.log(events)
        commit('throws', events)

        // for (i=0; i<events.length; i++) {
        //   var eventObj = events[i];
        //   console.log('Address: ' + eventObj.returnValues._from);
        //   console.log('Greeting: ' + web3.utils.hexToAscii(eventObj.returnValues._greeting));
        // }
      }
      catch (err) {
        console.error(err)
        commit('throws', false)
      }
    },
  },
})

export default store
