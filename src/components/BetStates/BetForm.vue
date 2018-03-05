<script>
import BetHeads from '../BetHeads'
import BetTails from '../BetTails'

export default {
  props: ['tossRead', 'tossWrite'],

  components: {
    BetHeads,
    BetTails,
  },
}
</script>

<template>
  <div class="columns">
    <div class="column">
      <bet-heads :tossWrite="tossWrite" />
    </div>
    <div class="is-divider-vertical" data-content="OR"></div>
    <div class="column">
      <bet-tails :tossWrite="tossWrite" :tossRead="tossRead" />
    </div>
  </div>
</template>
