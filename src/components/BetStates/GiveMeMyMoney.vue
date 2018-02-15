<script>
import { mapState } from 'vuex'

export default {
  props: ['toss'],

  data() {
    return {
      state: null, // null, is-success, is-danger, is-loading
    }
  },

  methods: {
    async giveMeMyMoney() {
      this.state = 'is-loading'
      this.error = null

      let options = {
        from: this.web3.eth.defaultAccount,
        gas: 4444444
      }

      try {
        let tx = await this.toss.methods.giveMeMyMoneyBack().send(options)
        console.log(tx)
        this.state = 'is-success'
      }
      catch (err) {
        console.error(err)
        this.error = err.message
        this.state = 'is-danger'
      }
    }
  },

  computed: {
    ...mapState(['web3']),
  }
}
</script>

<template>
  <div class="columns">
    <div class="column">
      <div class="field is-grouped">
        <p class="control">
          <a class="button is-small" :class="state" @click="giveMeMyMoney">
            Claim Unmatched Bet
          </a>
        </p>
      </div>
    </div>
  </div>
</template>
