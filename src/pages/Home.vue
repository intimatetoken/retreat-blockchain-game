<script>
  import Throw from '../components/PunterThrow'
  import { mapState } from 'vuex'

  export default {
    components: {
      Throw
    },

    data() {
      return {
        throws: []
      }
    },

    web3() {
      return {
        throws: {
          contract: this.spinner,
          event: 'Tossed'
        }
      }
    },

    computed: {
      ...mapState(['spinner'])
    }
  }
</script>

<template>
  <div class="section">
    <div class="container">
      <div class="timeline">
        <header class="timeline-header">
          <span class="tag is-medium is-primary">Start - 11am</span>
        </header>
        <throw v-for="toss in throws" :key="toss.id" :event="toss" />
        <div class="timeline-header">
          <span class="tag is-medium is-primary">Finish - 6pm</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  @import "../scss/bootstrap";
  @import "~bulma-timeline";
</style>
