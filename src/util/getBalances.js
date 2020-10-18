import {store} from '../store/'
var contract = require("truffle-contract");
//import cryptoz_artifacts from '../contracts/Cryptoz.json';
//import cryptoz_token_artifacts from '../contracts/CzxpToken.json';

//    window.Cryptoz   = contract(cryptoz_artifacts);
//    window.CzxpToken = contract(cryptoz_token_artifacts);

let getBalances = new Promise(function (resolve, reject) {
  console.log('GetBalances..in js');

    window.CzxpToken.deployed().then(function(instance) {
      console.log('get czxp balance in js...');
      return instance.balanceOf(this.coinbase);
    }).then(res => {
      console.log(res);
      return res;
    })
 
/**
    Cryptoz.deployed().then(function(instance) {
      console.log("get cryptoz cards tokens balance...");
      return instance.balanceOf(this.coinbase);
    }).then(this.setCryptozBalance)
          
    Cryptoz.deployed().then(function(instance) {
      return instance.boosterPacksOwned(this.coinbase);
    }).then(this.setBoostersOwned)
**/

  
  
  
})
/**
  .then(result => {
    return new Promise(function (resolve, reject) {
      // Retrieve network ID
      result.web3().version.getNetwork((err, networkId) => {
        if (err) {
          // If we can't find a networkId keep result the same and reject the promise
          reject(new Error('Unable to retrieve network ID'))
        } else {
          // Assign the networkId property to our result and resolve promise
          networkId = (networkId < 6000) ? networkId : '0'; //assign zero if internal network
          result = Object.assign({}, result, {networkId})
          resolve(result)
        }
      })
    })
  })
**/
export default getBalances