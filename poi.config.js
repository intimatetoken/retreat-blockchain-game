module.exports = (options, req) => ({
  env: {
    NETWORK_ID: process.env.NETWORK_ID || 5777,
    SPINNER: process.env.SPINNER || '0x38979119752B1891ae9B5cD6986285eA3190AE38'
  }
})
