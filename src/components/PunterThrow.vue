<script>
import moment from 'moment'
import _ from 'lodash'

import toss from '../mixins/throw'
import BetHeads from './BetHeads'
import BetTails from './BetTails'
import ClaimWinnings from './ClaimWinnings'

export default {
  mixins: [toss],

  components: {
    BetHeads,
    BetTails,
    ClaimWinnings,
  },

  data() {
    return {
      heads: null
    }
  },

  computed: {
    relavitiveStart() {
      let isPast = moment().isBefore(this.time)

      return isPast ?
        this.time.fromNow() : // ago
        this.time.toNow() // in
    },

    timeStart() {
      return this.time.format('h:mma')
    },

    image() {
      return `/static/images/${this.status}.jpg`
    }
  },

  methods: {
    headEmUp() {

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

      <div v-if="status == 'NotThrown'" class="columns">
        <div class="column">
          <bet-heads :toss="toss" />
        </div>
        <div class="is-divider-vertical" data-content="OR"></div>
        <div class="column">
          <bet-tails :toss="toss" />
        </div>
      </div>

      <div v-else class="columns">
        <div class="column">
          <div class="field is-grouped">
            <claim-winnings :toss="toss" />
            <p class="control">
              <a class="button is-small">
                Claim Unmatched Bet
              </a>
            </p>
          </div>
        </div>
      </div>

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
