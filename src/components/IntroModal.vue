<script>
  import StatusItem from './StatusItem'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      StatusItem
    },

    computed: {
      ...mapGetters(['hasWeb3'])
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
          <status-item :status="hasWeb3" text="Web3 Injected Browser" instructions="Get a Web3 Enabled browser like MetaMask" />
          <li>Wallet Unlocked</li>
          <li>On the right network</li>
          <li>Syncing with the blockchain</li>
          <li>Schooey of Carlton Draught</li>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success">Continue</button>
      </footer>
    </div>
  </div>
</template>
