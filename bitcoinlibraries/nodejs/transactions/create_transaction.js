var bitcoin = require('bitcoinjs-lib');



	
	
	
var network = bitcoin.networks.testnet


var keyPair = bitcoin.ECPair.fromWIF('cVAgu69d1z2nyo8AZSR7n4wHrXqV24GuRjZGNJ5j5G6AAjWzC8Av', network)

var tx = new bitcoin.TransactionBuilder(bitcoin.networks.testnet, 100)

tx.addInput('3be24831e3fb8a098b7e390a5c2e859f1aab981554b541f734d718af4612715e', 0)


tx.addOutput('mz7gMvf74DjwpnSRsN6a4mD4SVPYxNUHNa', 9900000)
tx.addOutput('mzExwQPeiME5UKJE9779UbMDa9vV74Y67w', 100000000) //back to my address




//console.log(tx.tx.outs[0].script.toString('hex'))
tx.sign(0, keyPair)
console.log("after signing");
console.log(tx.build().toHex());

//console.log(tx.tx);