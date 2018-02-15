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
    async claim() {
      this.state = 'is-loading'
      this.error = null

      let options = {
        from: this.web3.eth.defaultAccount,
        gas: 4444444
      }

      try {
        let tx = await this.toss.methods.claim().send(options)
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
  <div>
    <h1>YOU WON!</h1>
    <p class="control">
      <a class="button is-small" :class="state" @click="claim">
        Claim Winnings
      </a>
    </p>
  </div>
</template>
