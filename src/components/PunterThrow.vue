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
      return this.isAfterThrowTime ?
        this.data.time.fromNow() : // ago
        this.data.time.toNow() // in
    },

    isAfterThrowTime() {
      return moment().isAfter(this.data.time)
    },

    timeStart() {
      return this.data.time.format('h:mma')
    },

    image() {
      return `/static/images/${this.data.status}.jpg`
    },

    thrown() {
      return this.data.status !== 'None'
    },

    hasBet() {
      return this.data.bet !== 'None'
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

      if (this.thrown && this.data.winnings > 0) {
        return 'YouWon'
      }

      if (this.thrown && this.data.header > 0) {
        return 'GiveMeMyMoney'
      }

      if (this.thrown && this.data.bet !== 'None') {
        return 'BetterLuckNextTime'
      }

      if (this.thrown && this.data.bet === 'None') {
        return 'NoBet'
      }

      throw Error('Invalid state')
    }
  },

}
</script>

<template>
  <div v-if="ready" class="timeline-item">
    <div class="timeline-marker is-image is-64x64">
      <img :src="image">
    </div>
    <div class="timeline-content">
      <p class="heading">{{ relavitiveStart }} - {{ timeStart }}</p>

      <component :is="component" :toss="toss" :data="data" />

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
