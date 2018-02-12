<script>
import contract from 'truffle-contract'
import moment from 'moment'
import SpinnerContract from '../../build/contracts/Spinner.json'

export default {
  data() {
    return {
      when: null,
      loading: false
    }
  },

  methods: {
    async add() {
      this.loading = true

      let time = moment(this.when).unix()
      let spinner = await contract(SpinnerContract).setProvider(window.web3.currentProvider).deployed()
      let tx = await spinner.spin(time)

      this.loading = false
    }
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
