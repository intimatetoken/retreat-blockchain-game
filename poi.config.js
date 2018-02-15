module.exports = (options, req) => ({
  env: {
    MIN_NETWORK_ID: process.env.MIN_NETWORK_ID || 3,
    SPINNER: process.env.SPINNER || '0x38979119752B1891ae9B5cD6986285eA3190AE38'
  }
})
