var bitcoin = require('bitcoinjs-lib');
var fs = require('fs');




var network = bitcoin.networks.testnet

var keyPair = bitcoin.ECPair.makeRandom({network : network})

var privateKey = keyPair.toWIF();
var publicAddress = keyPair.getAddress();


var line =  [privateKey, publicAddress.toString('hex')]


var file_name = publicAddress+".csv"


var stream = fs.createWriteStream(file_name)

stream.once('open', function(fd) {
	stream.write(line.join(", "))
	stream.write("\n")
	stream.end()
})