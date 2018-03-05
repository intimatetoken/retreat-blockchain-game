<script>
import moment from 'moment'
import _ from 'lodash'

import toss from '../mixins/throw'
import BetHeads from './BetHeads'
import BetTails from './BetTails'

let states = {
  InTheAir: require('./BetStates/InTheAir').default,
  BetForm: require('./BetStates/BetForm').default,
  GoodLuck: require('./BetStates/GoodLuck').default,
  GiveMeMyMoney: require('./BetStates/GiveMeMyMoney').default,
  BetterLuckNextTime: require('./BetStates/BetterLuckNextTime').default,
  NoBet: require('./BetStates/NoBet').default,
  YouWon: require('./BetStates/YouWon').default,
}

export default {
  mixins: [toss],

  components: {
    ...states,
  },

  computed: {
    relavitiveStart() {
      return this.time.fromNow()
    },

    isAfterThrowTime() {
      return moment().isAfter(this.time)
    },

    timeStart() {
      return moment.unix(this.timestamp).format('h:mma')
    },

    image() {
      return `/images/${this.status}.jpg`
    },

    thrown() {
      return this.status !== 'None'
    },

    hasBet() {
      return this.bet !== 'None'
    },

    data() {
      return {
        time: this.time,
        status: this.status,
        bet: this.bet,
        header: this.header,
        winnings: this.winnings
      }
    },

    // https://www.lucidchart.com/documents/edit/3ca0e9aa-84eb-4b82-bbf1-a7bf6d947b2c/0
    component() {
      if (! this.thrown && this.isAfterThrowTime) {
        return 'InTheAir'
      }

      if (! this.thrown && ! this.isAfterThrowTime && ! this.hasBet) {
        return 'BetForm'
      }

      if (! this.thrown && ! this.isAfterThrowTime && this.hasBet) {
        return 'GoodLuck'
      }

      if (this.thrown && this.winnings > 0) {
        return 'YouWon'
      }

      if (this.thrown && this.header > 0) {
        return 'GiveMeMyMoney'
      }

      if (this.thrown && this.bet !== 'None') {
        return 'BetterLuckNextTime'
      }

      if (this.thrown && this.bet === 'None') {
        return 'NoBet'
      }

      throw Error('Invalid state')
    }
  },

}
</script>

<template>
  <div v-if="timestamp && status" class="timeline-item">
    <div class="timeline-marker is-image is-64x64">
      <img :src="image">
    </div>
    <div class="timeline-content">
      <p class="heading">{{ relavitiveStart }} - {{ timeStart }}</p>
      <component :is="component" :tossRead="tossRead" :tossWrite="tossWrite" :data="data" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "../scss/bootstrap";
  @import "~bulma-divider";

  .timeline-item .timeline-content {
    padding-left: 3rem;
  }

  .column {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
</style>
