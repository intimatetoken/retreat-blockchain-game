module.exports = (options, req) => ({
  env: {
    NETWORK_ID: process.env.NETWORK_ID || 3
  }
})
