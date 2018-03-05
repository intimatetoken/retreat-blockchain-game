<script>
import { mapState } from 'vuex'

import HeaderTemplate from './layout/HeaderTemplate'
import FooterTemplate from './layout/FooterTemplate'
import IntroModal from './components/IntroModal'

export default {

  data () {
    return {
      ready: false
    }
  },

  components: {
    IntroModal,
    HeaderTemplate,
    FooterTemplate
  },

  async beforeCreate() {
    await this.$store.dispatch('registerWeb3')
    await this.$store.dispatch('registerNetwork')
    await this.$store.dispatch('registerAddress')
    await this.$store.dispatch('registerBalance')
    await this.$store.dispatch('registerSpinner')
    this.ready = true
  },
}
</script>

<template>
  <div id="app">
    <IntroModal />
    <HeaderTemplate />
    <router-view v-if="ready"></router-view>
    <FooterTemplate />
  </div>
</template>
