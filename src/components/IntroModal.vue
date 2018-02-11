<script>
  import StatusItem from './StatusItem'
  import { mapState } from 'vuex'

  export default {
    components: {
      StatusItem
    },

    computed: {
      ...mapState([
        'web3',
        'network',
        'accounts',
        'balance',
        'throws'
      ]),

      networked () {
        return this.network === null ? null : this.network == process.env.NETWORK_ID
      },

      isGood () {
        let tests = [
          this.web3,
          this.accounts,
          this.networked,
          this.balance,
          this.throws
        ]

        return tests.every(item => item)
      }
    }
  }
</script>

<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Two Coins - One Block</p>
      </header>
      <section class="modal-card-body">
        <div class="content">
          <status-item :status="web3" text="Web3 Injected Browser" instructions="Get a Web3 Enabled browser like MetaMask" />
          <status-item :status="accounts" text="Wallet Unlocked" instructions="Unlock your wallet" />
          <status-item :status="networked" text="On the right network" instructions="Select the Ropsten network" />
          <status-item :status="balance" text="Got some eth for a bet" instructions="You're broke! Put some ETH in your wallet!" />
          <status-item :status="throws" text="Syncing with the blockchain" instructions="Eeep! Try and refresh." />
        </div>
      </section>
      <footer class="modal-card-foot">
        <button :disabled="! isGood" class="button is-success">Continue</button>
      </footer>
    </div>
  </div>
</template>
