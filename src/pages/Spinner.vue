<script>
// import contract from 'truffle-contract'
import moment from 'moment'
import { mapState } from 'vuex'

import Throw from '../components/SpinnerThrow'
import SpinnerContract from '../../build/contracts/Spinner.json'
import HelperContract from '../../build/contracts/TestHelper.json'

export default {
  components: {
    Throw
  },

  data() {
    return {
      when: moment().add(1, 'hour').format(moment.HTML5_FMT.DATETIME_LOCAL),
      loading: false,
      error: null,
      success: false
    }
  },

  methods: {
    async add() {
      this.loading = true
      this.error = null
      this.success = false

      let time = moment(this.when).unix()
      let address = process.env.SPINNER || SpinnerContract.networks[this.network].address
      let spinner = new this.web3.eth.Contract(SpinnerContract.abi, address)

      let options = {
        from: this.web3.eth.defaultAccount,
        gas: 4444444
      }

      try {
        let tx = await spinner.methods.spin(time).send(options)
        console.log(tx)
        this.$store.dispatch('registerThrows')
        this.success = true
      }
      catch (err) {
        console.error(err)
        this.error = 'Adding throw failed'
      }

      this.loading = false
    },
  },

  computed: {
    ...mapState(['web3', 'network', 'throws'])
  }
}
</script>

<template>
  <div class="section">
    <div class="container">
      <h1 class="title">Spinner</h1>
      <form @submit.prevent="add">
        <div class="field">
          <label class="label">Time</label>
          <div class="control">
            <input class="input" type="datetime-local" v-model="when" />
          </div>
        </div>
        <div class="field">
          <div class="control">
            <button class="button is-link" :class="{ 'is-loading': loading }">Add Throw</button>

            <div v-if="error" class="notification is-danger" v-text="error"></div>
            <div v-if="success" class="notification is-success">Throw added.</div>
          </div>
        </div>
      </form>

      <hr />

      <div class="columns is-multiline">
        <div class="column" v-for="toss in throws" :key="toss.id" >
          <throw :event="toss" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .notification {
    margin-top: 1.5rem;
  }
</style>
