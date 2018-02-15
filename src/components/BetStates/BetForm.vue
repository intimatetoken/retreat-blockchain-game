<script>
import BetHeads from '../BetHeads'
import BetTails from '../BetTails'

export default {
  props: ['toss'],

  components: {
    BetHeads,
    BetTails,
  },
}
</script>

<template>
  <div class="columns">
    <div class="column">
      <bet-heads :toss="toss" />
    </div>
    <div class="is-divider-vertical" data-content="OR"></div>
    <div class="column">
      <bet-tails :toss="toss" />
    </div>
  </div>
</template>
