import Web3 from 'web3'

let web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.WS_PROVIDER))

export default web3
