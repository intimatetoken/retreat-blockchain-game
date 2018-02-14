<script>
import toss from '../mixins/throw'

export default {
  mixins: [toss],

  data() {
    return {
      loading: false,
      success: false,
      error: null
    }
  },

  computed: {
    label() {
      if (! this.time) return

      return this.time.format('h:mma')
    }
  },

  methods: {
    async throwIt() {
      this.error = null
      this.success = false
      this.loading = true

      let options = {
        from: this.web3.eth.defaultAccount,
        gas: 4444444
      }

      try {
        let tx = await this.toss.methods.throwIt().send(options)
        console.log(tx)
        this.success = true
      }
      catch (err) {
        console.error(err)
        this.error = err.message
      }

      this.loading = false
    }
  }
}
</script>

<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        {{ label }}
      </p>
    </header>
    <div class="card-content">
      <div class="content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
      </div>
    </div>
    <footer class="card-footer">
      <a href="#" class="card-footer-item" :class="{ 'is-loading': loading, 'error': !! error, 'success': success }" @click.prevent="throwIt">
        <span class="icon">
          <i v-if="!! error" class="fas fa-exclamation" key="error"></i>
          <i v-else-if="success" class="fas fa-check" key="success"></i>
          <i v-else class="far fa-hand-point-up" key="hand"></i>
        </span>
        Throw
      </a>
    </footer>
  </div>
</template>

<style scoped>
  .error {
    color: red;
  }

  .success {
    color: green;
  }
</style>
