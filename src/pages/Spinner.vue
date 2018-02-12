<script>
// import contract from 'truffle-contract'
import moment from 'moment'
import { mapState } from 'vuex'

import SpinnerContract from '../../build/contracts/Spinner.json'

export default {
  data() {
    return {
      when: moment().format(moment.HTML5_FMT.DATETIME_LOCAL),
      loading: false,
      error: null
    }
  },

  methods: {
    async add() {
      this.loading = true

      let time = moment(this.when).unix()
      let address = SpinnerContract.networks[this.network].address
      let spinner = new this.web3.eth.Contract(SpinnerContract.abi, address)
      let method = spinner.methods.spin(time)
      // let estimate = await method.estimateGas()
      // console.log(estimate)

      let options = {
        from: this.web3.eth.defaultAccount,
        gas: 4444444
      }

      try {
        let tx = await method.send(options)
        console.log(tx)
      }
      catch (err) {
        console.error(err)
        this.error = err
      }

      this.loading = false
    }
  },

  computed: {
    ...mapState(['web3', 'network'])
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
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
