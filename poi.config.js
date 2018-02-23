module.exports = (options, req) => ({
  env: {
    MIN_NETWORK_ID: process.env.MIN_NETWORK_ID || 3,
    SPINNER: process.env.SPINNER
  }
})
