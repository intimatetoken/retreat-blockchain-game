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
      if (! this.time) return

      return moment().isBefore(this.time) ? this.time.toNow() : this.time.fromNow()
    },

    timeStart() {
      if (! this.time) return

      return this.time.format('h:mma')
    },

    headers() {
      let eths = _.range(0, 10, 0.001)
      console.log(eths)
    }
  },

  methods: {
    headEmUp() {

    }
  },
}
</script>

<template>
  <div class="timeline-item">
    <div class="timeline-marker is-image is-64x64">
      <img src="http://bulma.io/images/placeholders/64x64.png">
    </div>
    <div class="timeline-content">
      <p class="heading">{{ relavitiveStart }} - {{ timeStart }}</p>

      <div class="columns">
        <div class="column">
          <bet-heads :toss="toss" />
        </div>
        <div class="is-divider-vertical" data-content="OR"></div>
        <div class="column">
          <bet-tails :toss="toss" />
        </div>
        <div class="is-divider-vertical" data-content="OR"></div>
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
    padding-left: 3em;
  }
</style>
