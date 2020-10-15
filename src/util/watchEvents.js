import {store} from '../store/'

let watchEvents = function (state) {
  
  let web3 = window.web3
  web3 = new Web3(web3.currentProvider)
  
  //This is all about CZXP tokens.. deal with events to this
  CzxpToken.deployed().then(function(instance) {
    var czxpEvents = instance.allEvents({fromBlock: 'latest'});
    
    czxpEvents.watch(function(error, event){
      //console.log('From WatchEvents.js...');
      if (!error){
        console.log('czxpEvents events captured!', event);
        //IF event affects our wallet, dispatch
        if(event.args.to == store.state.web3.coinbase){
          store.dispatch('updateOwnerBalances', event);
        }
        //Otherwise a czxp event ALWAYS updates the universe balance
          store.dispatch('updateUniverseBalances', event);
      }else{
        console.log("ERROR in watchEvents.js czxpEvents : ", error);
      }
    });
  
  })
  
  //This is all about Cryptoz tokens.. deal with events to this
  Cryptoz.deployed().then(function(instance) {
    var cryptozEvents = instance.allEvents({fromBlock: 'latest'});
    
    cryptozEvents.watch(function(error, event){
      //console.log('From WatchEvents.js...');
      if (!error){
        console.log('Cryptoz events captured! : ', event);
        //IF event affects our wallet, dispatch
        if(event.args.to == store.state.web3.coinbase ||
           event.args.player == store.state.web3.coinbase){
          store.dispatch('updateOwnerBalances', event);
        }
        //Otherwise a czxp event ALWAYS updates the universe balance
        store.dispatch('updateUniverseBalances', event);
      }else{
        console.log("ERROR in watchEvents.js : ", error);
      }
    });
  
  })
}

export default watchEvents