<script>
import { mapState } from 'vuex'

export default {
  props: ['toss'],

  data() {
    return {
      header: null,
      bets: [],
      state: null, // null, is-loading, error, success
    }
  },

  async created() {
    let bets = await this.toss.getPastEvents('HeaderBet', {
      fromBlock: 0,
      toBlock: 'latest'
    })

    this.bets = bets
  },

  methods: {
    async illTakeYa() {
      this.state = 'is-loading'
      this.error = null

      let options = {
        from: this.web3.eth.defaultAccount,
        value: this.header.returnValues.value,
        gas: 4444444
      }

      let idx = parseInt(this.header.returnValues.idx)

      try {
        let tx = await this.toss.methods.illTakeYa(idx).send(options)
        console.log(tx)
        this.state = 'success'
      }
      catch (err) {
        console.error(err)
        this.error = err.message
        this.state = 'error'
      }
    },

    fromWei(value) {
      return this.web3.utils.fromWei(value)
    }
  },

  computed: {
    ...mapState(['web3']),
  }
}
</script>

<template>
  <div class="field has-addons" :class="state">
    <div class="control has-icons-left">
      <div class="select">
        <select v-model="header">
          <option v-for="bet in bets" :key="bet.id" :value="bet">
            {{ fromWei(bet.returnValues.value) }}
          </option>
        </select>
      </div>
      <span class="icon is-small is-left">
        <i v-if="state !== 'error'" class="fab fa-ethereum"></i>
        <i v-if="state === 'error'" class="fas fa-exclamation"></i>
      </span>
    </div>
    <div class="control">
      <button type="submit" class="button is-primary" :class="state" @click.prevent="illTakeYa">Bet Tails</button>
    </div>
  </div>
</template>

<style scoped>
  .error .control.has-icons-left .icon {
    color: red;
  }
</style>
