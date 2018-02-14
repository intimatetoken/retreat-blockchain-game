module.exports = {
  toStatus (status) {
    status = status.toNumber ? status.toNumber() : parseInt(status)

    switch (status) {
      case 0:
        return 'NotThrown'

      case 1:
        return 'Heads'

      case 2:
        return 'Tails'
    }
  },

  toBet (bet) {
    return {
      header: bet[0],
      tailer: bet[1],
      amount: bet[2]
    }
  },

  toHeader (header) {
    return {
      owner: header[0],
      amount: header[1]
    }
  }
}
