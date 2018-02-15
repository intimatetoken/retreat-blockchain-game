import Promise from 'bluebird'
import moment from 'moment'
import { mapState } from 'vuex'

import mapper from '../helpers/mapper.js'
import ThrowContract from '../../build/contracts/Throw.json'

export default {
  props: ['event'],

  data () {
    return {
      toss: null,
      data: {
        time: null,
        status: null,
        bet: null,
        winnings: null,
      },
      ready: false
    }
  },

  async created () {
    this.toss = new this.web3.eth.Contract(ThrowContract.abi, this.event.returnValues.where)

    let data = await Promise.props({
      time: this.toss.methods.throwTime().call(),
      status: this.toss.methods.status().call(),
      header: this.toss.methods.headers(this.address).call(),
      bet: this.toss.methods.bets(this.address).call(),
      winnings: this.toss.methods.winnings(this.address).call(),
    })

    data.time = moment.unix(data.time)
    data.status = mapper.toStatus(data.status)
    data.bet = mapper.toStatus(data.bet)

    this.data = data
    this.ready = true
  },

  computed: {
    ...mapState(['web3', 'network', 'address'])
  }
}
