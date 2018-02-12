import moment from 'moment'
import { mapState } from 'vuex'

import ThrowContract from '../../build/contracts/Throw.json'

export default {
  props: ['event'],

  data () {
    return {
      toss: null,
      time: null
    }
  },

  async created () {
    this.toss = new this.web3.eth.Contract(ThrowContract.abi, this.event.returnValues.where)

    this.time = moment.unix(await this.toss.methods.throwTime().call())
  },

  computed: {
    ...mapState(['web3', 'network'])
  }
}
