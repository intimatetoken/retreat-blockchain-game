module.exports = {
  toStatus (status) {
    status = status.toNumber ? status.toNumber() : parseInt(status)

    switch (status) {
      case 0:
        return 'None'

      case 1:
        return 'Heads'

      case 2:
        return 'Tails'
    }
  },

  toBet (bet) {
    return {
      heads: bet[0],
      tails: bet[1],
      amount: bet[2]
    }
  },
}
