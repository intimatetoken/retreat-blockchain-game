<script>
import { mapState } from 'vuex'

import HeaderTemplate from './layout/HeaderTemplate'
import FooterTemplate from './layout/FooterTemplate'
import IntroModal from './components/IntroModal'

export default {

  components: {
    IntroModal,
    HeaderTemplate,
    FooterTemplate
  },

  async beforeCreate() {
    await this.$store.dispatch('registerWeb3')
    await this.$store.dispatch('registerNetwork')
    // await this.$store.dispatch('updateUserBlockchainStatus')
  },
}
</script>

<template>
  <div id="app">
    <IntroModal />
    <HeaderTemplate />
    <router-view />
    <FooterTemplate />
  </div>
</template>
