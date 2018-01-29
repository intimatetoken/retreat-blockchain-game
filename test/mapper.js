module.exports = {
  toStatus (status) {
    switch (status.toNumber()) {
      case 0:
        return 'NotThrown'

      case 1:
        return 'Heads'

      case 2:
        return 'Tails'
    }
  }
}
