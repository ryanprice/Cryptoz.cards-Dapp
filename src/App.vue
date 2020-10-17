<template>
  <div id="app">
    <AppHeader v-on:on-connect="onConnect" />
    <transition name="component-fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <AppFooter />
  </div>
</template>

<script>
import BodyContent from './components/BodyContent'
import AppHeader from './components/layout/AppHeader'
import AppFooter from './components/layout/AppFooter'
import {mapState} from 'vuex'

window.dynamicSort = function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

window.sortAttributes = function sortAttributes(property) {
    //console.log(property);
    
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a.attributes[property] < b.attributes[property]) ? -1 : (a.attributes[property] > b.attributes[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

import Web3Modal from "web3modal";
import BurnerConnectProvider from "@burner-wallet/burner-connect-provider";
import WalletConnectProvider from "@walletconnect/web3-provider";
const Torus = require("@toruslabs/torus-embed");
const Portis = require("@portis/web3");
const Fortmatic = require("fortmatic");

const testEnv = true

const providerOptions = {
  torus: {
    package: Torus,
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
    },
  },
  burnerconnect: {
    package: BurnerConnectProvider,
    options: {
      defaultWallets: [
        { origin: "https://denver-demo.burnerfactory.com/", name: "Denver Demo Wallet" },
      ],
    },
  },
  portis: {
    package: Portis,
    options: {
      id: "1f9427a6-ceef-4d45-a6df-79f081e909d9",
    },
  },
  fortmatic: {
    package: Fortmatic,
    options: {
      key: testEnv ? "pk_test_2ED863FB3FCEB2F3" : "pk_live_6D8AC68104516C09",
    },
  }
}


// Import our contract artifacts and turn them into usable abstractions.

import axios from 'axios';
var contract = require("truffle-contract");
import cryptoz_artifacts from './contracts/Cryptoz.json';
import cryptoz_token_artifacts from './contracts/CzxpToken.json';

export default {
  name: 'App',
  components: {
    BodyContent,
    AppHeader,
    AppFooter
  },
  beforeCreate() {
    //this.init()
    //console.log('registerWeb3 Action dispatched from App.vue')
    //this.$store.dispatch('registerWeb3')
  },
  data() {
    return {
      wallet : '',
      wallet_balance : 0,
      network_name : 'Detecting Ethereum network..Loading',
      eth_network_name : ''
    }
  },
  mounted() {
    window.Cryptoz   = contract(cryptoz_artifacts);
    window.CzxpToken = contract(cryptoz_token_artifacts);

    if (window.web3 && window.web3.currentProvider) {
      this.getWalletInfo()
      this.setContractProvider(window.web3.currentProvider)
      this.subscribeToProviderEvents(window.web3.currentProvider)
      this.$store.dispatch('web3isConnected', true)
    }
  },
  methods : {
    subscribeToProviderEvents: function(provider) {
      // Subscribe to accounts change
      provider.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          this.getWalletInfo()
        }
        //user "locks" their wallet
        else {
          this.disconnectWallet()
        }
      });
      // Subscribe to chainId change
      provider.on("chainChanged", () => {
        this.getWalletInfo()
      });
      // Subscribe to provider connection
      provider.on("connect", () => {
        this.getWalletInfo()
      });
      // Subscribe to provider disconnection
      provider.on("disconnect", () => {
        this.disconnectWallet()
      });
    },
    setContractProvider: function(provider) {
      Cryptoz.setProvider(provider);
      CzxpToken.setProvider(provider);
    },
    onConnect: async function() {
      const web3Modal = new Web3Modal({
        // cacheProvider: true, // optional
        providerOptions
      });

      const provider = await web3Modal.connect()
      await provider.enable()
      const web3 = new Web3(provider)
      window.web3 = web3
      this.setContractProvider(provider)
      this.subscribeToProviderEvents(provider)
      this.$store.dispatch('web3isConnected', true)
    },
    getWalletInfo: function() {
      window.web3.eth.getCoinbase((err, coinbase) => {
        if (err) {
          throw new Error(err)
        }
        if (coinbase !== null) {
          window.web3.eth.getBalance(coinbase, (err, balance) => {
            console.log('balance: ', balance)
            this.$store.dispatch('updateWallet', {coinbase, balance})
          })
        }
      })
    },
    disconnectWallet: function() {
      this.$store.dispatch('web3isConnected', false)
      this.$store.dispatch('updateWallet', {coinbase: null, balance: null})
    },
    // init :  function() {
    //   console.log('Starting up the app..');

    //   // Cryptoz is our usable abstraction, which we'll use through the code below
    //   window.Cryptoz   = contract(cryptoz_artifacts);
    //   window.CzxpToken = contract(cryptoz_token_artifacts);
    //   Cryptoz.setProvider(web3.currentProvider);
    //   CzxpToken.setProvider(web3.currentProvider);
    //   console.log('Cryptoz and czxp token contracts are defined...');
      
    //   //Set some Log watches
    //   console.log('Setting Log event watches..');
      
      
    //   var cardOpenedEvent;
    //   var cardPurchasedEvent;
    //   var cardCreatedEvent;
    //   var cardTransferEvent;
    //   var boostCardPurchasedEvent;
    //   var sacrificeCardEvent;
    //   var czxpGainedEvent;
      
    //   Cryptoz.deployed().then(function(instance) {
        
    //     cardOpenedEvent = instance.LogPackOpened();
    //     cardPurchasedEvent = instance.LogCardPurchased();
    //     cardCreatedEvent = instance.LogCardCreated();
    //     cardTransferEvent = instance.TokenTransfer();
    //     czxpGainedEvent = instance.CZXPGained();
    //     sacrificeCardEvent = instance.SacrificeCardEvent();
        
    //     cardOpenedEvent.watch(function(error, result){
    //       if(!error){
    //         console.log("cardOpenedEvent result:");
    //         console.log(result);

    //       }else{
    //         console.log("cardOpenedEvent error:" . error);
    //       }
    //     });
      
    //     cardPurchasedEvent.watch(function(error, result){
    //       if(!error){
    //         console.log("cardPurchasedEvent result:");
    //         console.log(result);

    //       }else{
    //         console.log("cardPurchasedEvent error:" . error);
    //       }
    //     });
        
    //     cardCreatedEvent.watch(function(error, result){
    //       if(!error){
    //         console.log("cardCreatedEvent result:");
    //         //console.log(result);
            
    //         //Lets update our token tracking table
    //         if(result.event == "LogCardCreated" && typeof(window.account) !== "undefined")
    //         {
    //           //console.log(result.args.cardTokenId.c[0]);
    //           //console.log(result.args.cardTypeId.c[0]);
    //           //console.log(result.args.editionNumber.c[0]);
    //           console.log('Updating tokens table...');
    //           //Send to the service
    //           var dataString = 'token_id=' + result.args.cardTokenId.c[0] + '&edition_number=' + result.args.editionNumber.c[0] + '&transfer_count=1&card_type_id=' + result.args.cardTypeId.c[0] + '&owner=' + account;
    //           var res = axios.get('https://cryptoz.cards/services/setTokenData.php?' + dataString);
    //           //console.log('axios result:' + dataString)
    //           //console.log(res);
    //         }
    //       }else{
    //         console.log("cardCreatedEvent error:" . error);
    //       }
    //     });
        
    //     cardTransferEvent.watch(function(error, result){
    //       if(!error){
    //         console.log("cardTransferEvent result:");
    //         console.log(result);
            
    //       }else{
    //         console.log("cardTransferEvent error:" . error);
    //       }
    //     });
    
    //     sacrificeCardEvent.watch(function(error, result){
    //       if(!error){
    //         console.log("sacrificeCardEvent result:");
    //         console.log(result);
            
    //       }else{
    //         console.log("sacrificeCardEvent error:" . error);
    //       }
    //     });
        
    //   })
      
    // },
    setName : function(block) {
      //console.log('setName called...' + block.number);
      this.network_name = 'You are connected to Ethereum ' + this.eth_network_name +' Block: '+ block.number.toString();
    },
    setSubscriptions : function() {
      console.log('Setting all subscriptions...');
      
      //This fires every time MetaMask is opened
      web3.currentProvider.publicConfigStore.on('update', this.handleUserChange);
      
      var subscription = web3.eth.subscribe('newBlockHeaders', function(error, result){
        if (!error) {
          //console.log("New block headers incoming..");
          //console.log(result);
          return;
        }
        //console.error(error);
      })
      //.on("data", function(blockHeader) {
      .on("data", this.setName) //pass the block number into our function
      .on("error", console.error);
      
    },
    handleTransaction : function(val) {
      console.log('Parent caught the transaction..' + val);
    }
  } //methods
}

</script>

<style>
  .headerComponent{
    margin-bottom:2em;
  }
  .jumbotron{
    margin-top:6em;
  }
  
  .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .3s ease;
  }
  .component-fade-enter, .component-fade-leave-to
    /* .component-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .toast-wrapper {
    display: flex;
    align-items: center;
  }

  .toast-message {
    margin-left: 10px;
    font-size: 20px;
  }
</style>
