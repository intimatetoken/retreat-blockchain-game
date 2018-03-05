import Promise from 'bluebird'
import moment from 'moment'
import { mapState } from 'vuex'

import mapper from '../helpers/mapper.js'
import websocket3 from '../providers/websocket3'
import ThrowContract from '../../build/contracts/Throw.json'

export default {
  props: ['event'],

  data() {
    return {
      timestamp: null,
      statusCode: null,
      betCode: null,
    }
  },

  web3() {
    this.tossRead = new websocket3.eth.Contract(ThrowContract.abi, this.event.returnValues.where)
    this.tossWrite = new this.web3.eth.Contract(ThrowContract.abi, this.event.returnValues.where)

    return {
      timestamp: { contract: this.tossRead, method: 'throwTime' },
      statusCode: { contract: this.tossRead, method: 'status' },
      betCode: { contract: this.tossRead, method: 'bets', args: [this.address] },
      header: { contract: this.tossRead, method: 'headers', args: [this.address] },
      winnings: { contract: this.tossRead, method: 'winnings', args: [this.address] },
    }
  },

  computed: {
    ...mapState(['web3', 'address']),

    status() {
      return this.statusCode && mapper.toStatus(this.statusCode)
    },

    bet() {
      return this.betCode && mapper.toStatus(this.betCode)
    },

    time() {
      return this.timestamp && moment.unix(this.timestamp)
    }
  }
}
