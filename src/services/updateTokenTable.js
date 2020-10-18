var schedule = require('node-schedule');
var Web3 = require('web3');
var contract = require("@truffle/contract");

var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = "about raccoon battle bunker weekend direct drip below prevent sea thrive message";

let provider = new HDWalletProvider(mnemonic,"https://rinkeby.infura.io/v3/d9b0212980d3471283f7b301b50d5362")

const web3 = new Web3(provider);


//Infura HttpProvider Endpoint
//web3 = new web3(new web3.providers.HttpProvider("https://rinkeby.infura.io/v3/d9b0212980d3471283f7b301b50d5362"));


// Import our contract artifacts and turn them into usable abstractions.
import cryptozArtifacts from '../contracts/Cryptoz.json';
import cryptozTokenArtifacts from '../contracts/CzxpToken.json';


// Cryptoz is our usable abstraction, which we'll use through the code below.
var Cryptoz = contract(cryptozArtifacts);
var CzxpToken = contract(cryptozTokenArtifacts);

Cryptoz.setProvider(web3.currentProvider);
CzxpToken.setProvider(web3.currentProvider);


//console.log('web3 version', web3.version);



//watch Cryptoz events
window.Cryptoz.deployed().then(function(instance) {
  
//  return instance.totalSupply.call();
//}).then(function(res){console.log(res.toString(10))})

  console.log('contract options:' ,instance.options)
  
  console.log('got instance, get all events..');
  
  var cryptozEvents = instance.allEvents({from: 0}, function(error, event){
    console.log('From inside allEvents...');
        
    if (!error){
        
      console.log('Cryptoz events captured! : ', event);
        
        
    }else{
      console.log("ERROR allEvents : ", error);
    }
    
  });
  console.log('Got here..', cryptozEvents);
})

