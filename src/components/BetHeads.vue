<script>
import { mapState } from 'vuex'

export default {
  props: ['tossWrite'],

  data() {
    return {
      amount: '0.001',
      state: null, // null, is-loading, error, success
    }
  },

  methods: {
    async headEmUp() {
      this.state = 'is-loading'
      this.error = null

      let options = {
        from: this.web3.eth.defaultAccount,
        value: this.web3.utils.toWei(this.amount),
        gas: 4444444
      }

      try {
        let tx = await this.tossWrite.methods.headEmUp().send(options)
        console.log(tx)
        this.state = 'success'
      }
      catch (err) {
        console.error(err)
        this.error = err.message
        this.state = 'error'
      }
    }
  },

  computed: {
    ...mapState(['web3'])
  }
}
</script>

<template>
  <div class="field has-addons" :class="state">
    <div class="control has-icons-left">
      <input class="input" type="email" placeholder="0.001" v-model="amount">
      <span class="icon is-small is-left">
        <i v-if="state !== 'error'" class="fab fa-ethereum"></i>
        <i v-if="state === 'error'" class="fas fa-exclamation"></i>
      </span>
    </div>
    <div class="control">
      <button type="submit" class="button is-primary" :class="state" @click.prevent="headEmUp">Bet Heads</button>
    </div>
  </div>
</template>

<style scoped>
  .error .control.has-icons-left .icon {
    color: red;
  }
</style>
