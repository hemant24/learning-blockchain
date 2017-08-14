// got coins from https://testnet.manu.backend.hamburg/faucet

bcypher = require('blockcypher');

var bcapi = new bcypher('btc','test3','94ebe496367a498a9a883cd4804727e4');

function printResponse(err, data) {
console.log("====================== data ====================");
  if (err !== null) {
    console.log(err);
  } else {
    console.log(data);
  }
}
var addr = "mzExwQPeiME5UKJE9779UbMDa9vV74Y67w";

//var addr = "mz7gMvf74DjwpnSRsN6a4mD4SVPYxNUHNa";


bcapi.getAddrFull(addr, {}, printResponse);



bcapi.getAddr(addr, {unspentOnly:true}, printResponse);