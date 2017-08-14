//References : http://cryptocoinjs.com/modules/crypto/ecurve/

//First create random number of 32 byte. This acts as private key.
var randomBytes = require('randombytes')
var privateKey = randomBytes(32)
console.log("private key : " + privateKey.toString('hex'));

//Public is defined as a point on elliptic curve. Point is calculated as K = k * G, where K is public key ( point on elliptic curve), k is private key, G is constant defined in secp256k1

var ecurve = require('ecurve')
var ecparams = ecurve.getCurveByName('secp256k1')
var BigInteger = require('bigi')

// curvePt = G*k ( private key)
var curvePt = ecparams.G.multiply(BigInteger.fromBuffer(privateKey))

var x = curvePt.affineX.toBuffer(32)
var y = curvePt.affineY.toBuffer(32)

console.log('x : ' + x.toString('hex'))
console.log('y : ' + y.toString('hex'))


var unCompressedPublicKey = Buffer.concat([new Buffer([0x04]), x, y])
//0x04 -> uncompressed
//0x02 -> compressed -y
//0x03 -> compressed +y

//we can calcuate y from elliptic curve y2 = x3 + 7.

console.log('uncompressed public key is ' + unCompressedPublicKey.toString('hex'))


//alternatively
unCompressedPublicKey = curvePt.getEncoded(false) //false forces uncompressed public key
console.log('alternative uncompressed public key is ' + unCompressedPublicKey.toString('hex'))


//want compressed?
var compressedPublicKey = curvePt.getEncoded(true) //true forces compressed public key
console.log('alternative compressed public key is ' + compressedPublicKey.toString('hex'))
console.log("Notice that is just x value with prefix either 0x02 or 0x03 depanding upon -y or +y")



//This now we get private key and public key. We want to generate address out of public key.

//1. First generate Public hash ripemd160( sha256 (publicKey)))

var createHash = require('create-hash')

var sha = createHash('sha256').update(compressedPublicKey).digest()
var compressedPubkeyHash = createHash('rmd160').update(sha).digest()

console.log("Compressed Public key hash "  +  compressedPubkeyHash.toString('hex'));



//2. Calculate append version

var network =  {
  bitcoin: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80
  },
  testnet: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef
  },
  litecoin: {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bip32: {
      public: 0x019da462,
      private: 0x019d9cfe
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0
  }
}

var payload = new Buffer(21) // Here 21 because public key hash is for 20 Byte or 160 bit length because of operation createHash('rmd160')
	//2a. Append required version
	payload.writeUInt8(network.testnet.pubKeyHash, 0) //second parameter is offset.
	compressedPubkeyHash.copy(payload, 1) //second parameter is offset , 1 byte is representing version.
	
	console.log('After prepending version' + payload.toString('hex'));

//3. Added checksum, checksum is calculated using double sha256 ie sha256(sha256(payload))

var checksum = sha256x2(payload);
console.log('checksum is ' + checksum.toString('hex'))

var base58 = require('bs58')


var address = base58.encode(Buffer.concat([
    payload,
    checksum
  ], payload.length + 4))
  
  
  console.log('address is ' + address.toString('hex'));
  console.log(' prefix m or n show test bitcoin address');
  
  
  
  // SHA256(SHA256(buffer))
function sha256x2 (buffer) {
  var tmp = createHash('sha256').update(buffer).digest()
  return createHash('sha256').update(tmp).digest()
}


var wif = require('wif') //I encourage you to go throught its code to understand how its generating key.
var privatekeywif =  wif.encode(network.testnet.wif, privateKey, false) //3rd parameter is compressed or not.

console.log('Private key ' + privatekeywif.toString('hex'));
//Similar you can generate private key so that it can be store in wallet. WIF : wallet import format.

