module.exports = (options, req) => ({
  env: {
    MIN_NETWORK_ID: process.env.MIN_NETWORK_ID || 3,
    SPINNER: process.env.SPINNER,
    WS_PROVIDER: process.env.WS_PROVIDER || 'ws://localhost:8545'
  }
})
