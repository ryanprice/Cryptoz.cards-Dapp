import {store} from '../store/'

let watchEvents = function ({
  onCardMinted
}) {
  //This is all about CZXP tokens.. deal with events to this
  window.CzxpToken.deployed().then(function(instance) {
    var czxpEvents = instance.allEvents({fromBlock: 'latest'});
    
    czxpEvents.watch(function(error, event){
      if (!error){
        console.log({event: event.event})
        // console.log('CZXP events captured! : ', event);
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
  window.Cryptoz.deployed().then(function(instance) {
    var cryptozEvents = instance.allEvents({fromBlock: 'latest'});
    
    cryptozEvents.watch(function(error, event){
      switch (event.event) {
        case 'LogCardCreated':
          onCardMinted({
            cardTypeId: parseInt(event.args.cardTypeId).toString(),
            editionNumber: parseInt(event.args.editionNumber).toString(),
          })
          break
        default:
          break
      }
      if (!error){
        // console.log('Cryptoz events captured! : ', event);
        //IF event affects our wallet, dispatch
        if(event.args.to == store.state.web3.coinbase ||
           event.args.player == store.state.web3.coinbase){
          store.dispatch('updateOwnerBalances', event);
        }
        //Otherwise a czxp event ALWAYS updates the universe balance
        store.dispatch('updateUniverseBalances', event);
      }else{
        console.log("ERROR in watchEvents.js cryptozEvents: ", error);
      }
    });
  
  })
}

export default watchEvents