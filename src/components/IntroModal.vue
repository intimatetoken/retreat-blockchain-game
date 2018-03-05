<script>
  import StatusItem from './StatusItem'
  import { mapState } from 'vuex'

  export default {
    components: {
      StatusItem
    },

    data() {
      return {
        open: true
      }
    },

    computed: {
      ...mapState([
        'web3',
        'network',
        'address',
        'balance',
        'throws'
      ]),

      networked () {
        return this.network === null ? null : this.network >= process.env.MIN_NETWORK_ID
      },

      isGood () {
        let tests = [
          this.web3,
          this.address,
          this.networked,
          this.balance
        ]

        return tests.every(item => item)
      }
    }
  }
</script>

<template>
  <div class="modal" :class="{ 'is-active': open }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Two Coins - One Block</p>
      </header>
      <section class="modal-card-body">
        <div class="content">
          <status-item :status="web3" text="Web3 Injected Browser" instructions="Get a Web3 Enabled browser like MetaMask" />
          <status-item :status="address" text="Wallet Unlocked" instructions="Unlock your wallet" />
          <status-item :status="networked" text="On the right network" instructions="Select the Ropsten network" />
          <status-item :status="balance" text="Got some eth for a bet" instructions="You're broke! Put some ETH in your wallet!" />
        </div>
      </section>
      <footer class="modal-card-foot">
        <button :disabled="! isGood" class="button is-success" @click="open = false">Continue</button>
      </footer>
    </div>
  </div>
</template>
