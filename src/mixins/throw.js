import moment from 'moment'
import { mapState } from 'vuex'

import mapper from '../../test/helpers/mapper.js'
import ThrowContract from '../../build/contracts/Throw.json'

export default {
  props: ['event'],

  data () {
    return {
      toss: null,
      time: null,
      status: null,
      ready: false
    }
  },

  async created () {
    this.toss = new this.web3.eth.Contract(ThrowContract.abi, this.event.returnValues.where)

    let results = await Promise.all([
      this.toss.methods.throwTime().call(),
      this.toss.methods.status().call(),
    ])

    this.time = moment.unix(results[0])
    this.status = mapper.toStatus(results[1])

    this.ready = true
  },

  computed: {
    ...mapState(['web3', 'network'])
  }
}
