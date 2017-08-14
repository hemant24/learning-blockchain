var bitcoin = require('bitcoinjs-lib')



var network = bitcoin.networks.testnet
var mainNetKeyPair  = bitcoin.ECPair.makeRandom()
var testNetKeyPair  = bitcoin.ECPair.makeRandom({network : network})
console.log("Main Net address " + mainNetKeyPair.getAddress())
console.log("Test Net address " + testNetKeyPair.getAddress())

console.log("Compressed main net public key " + mainNetKeyPair.getPublicKeyBuffer().toString('hex'))