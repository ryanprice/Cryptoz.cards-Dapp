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

import Web3Modal from "web3modal";
import BurnerConnectProvider from "@burner-wallet/burner-connect-provider";
import WalletConnectProvider from "@walletconnect/web3-provider";
import '@metamask/legacy-web3'
const {web3} = window
const Torus = require("@toruslabs/torus-embed");
const Portis = require("@portis/web3");
const Fortmatic = require("fortmatic");
import './main.css'

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
      key: process.env.NODE_ENV === 'production' ? "pk_live_6D8AC68104516C09" : "pk_test_2ED863FB3FCEB2F3",
    },
  }
}


// Import our contract artifacts and turn them into usable abstractions.

import axios from 'axios';
var contract = require("truffle-contract");
import cryptoz_artifacts from './contracts/Cryptoz.json';
import cryptoz_token_artifacts from './contracts/CzxpToken.json';
import watchEvents from './util/watchEvents';
import { showSuccessToast } from './util/showToast'
import {store} from './store/index'

function setContractProvider(provider) {
  window.Cryptoz.setProvider(provider);
  window.CzxpToken.setProvider(provider);
}

function onCardMinted({
  cardTypeId,
  editionNumber,
}) {
  store.dispatch('updateMintedCountForCard', { cardTypeId, editionNumber })
}

function subscribeToEvents() {
  watchEvents({ onCardMinted })
}

export default {
  name: 'App',
  components: {
    BodyContent,
    AppHeader,
    AppFooter
  },
  mounted() {
  },
  beforeCreate() {
    window.Cryptoz   = contract(cryptoz_artifacts)
    window.CzxpToken = contract(cryptoz_token_artifacts)
    // tell provider not to refresh page on network change
    // instead we listen to on chainChanged event

    // this needs to be set in beforeCreate because vue lifecycle
    // is Parent create -> child create -> child mount -> parent mount
    // and we need provider to be set in child components
    if (window.web3 && window.web3.currentProvider) {
      setContractProvider(window.web3.currentProvider)
      subscribeToEvents()
    }
  },
  data() {
    return {
      wallet : '',
      wallet_balance : 0,
      network_name : 'Detecting Ethereum network..Loading',
      eth_network_name : ''
    }
  },
  computed: {
    coinbase() {
      return this.$store.state.web3.coinbase;
    }
  },
  watch: {
    coinbase(val, oldVal) {
      if (val && oldVal && val !== oldVal) {
        showSuccessToast(this, 'Successfully changed wallets.');
      }
    }
  },
  mounted() {
    window.ethereum.autoRefreshOnNetworkChange = false
    // we have no way of getting chainId here in web3 v0.20.7
    if (window.web3 && window.web3.currentProvider) {
      this.getWalletInfo()
      this.subscribeToProviderEvents(window.web3.currentProvider)
      this.$store.dispatch('web3isConnected', true)
    }
        // Twitter library - footer follow button uses it
        window.twttr = (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0],
            t = window.twttr || {};
          if (d.getElementById(id)) return t;
          js = d.createElement(s);
          js.id = id;
          js.src = "https://platform.twitter.com/widgets.js";
          fjs.parentNode.insertBefore(js, fjs);
        
          t._e = [];
          t.ready = function(f) {
            t._e.push(f);
          };
        
          return t;
        }(document, "script", "twitter-wjs"));
  },
  methods : {
    subscribeToProviderEvents: function(provider) {
      provider.on("connect", ({chainId}) => {
        this.$store.dispatch('web3isConnected', true)
        this.$store.dispatch('chainChanged', chainId)
        this.getWalletInfo()
      });
      provider.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          this.$store.dispatch('web3isConnected', true)
          this.getWalletInfo()
          subscribeToEvents()
        }
        //user "locks" their wallet via provider
        else {
          this.disconnectWallet()
        }
      });
      provider.on("chainChanged", (chainId) => {
        // without this check it auto-reloads to infinity
        const currentChainId = localStorage.getItem('ethChainId')
        if (currentChainId) {
          this.$store.dispatch('chainChanged', currentChainId)
        }
        if (currentChainId !== chainId) {
          localStorage.setItem('ethChainId', chainId)
          window.location.reload()
          return
        }
      });
      provider.on("disconnect", () => {
        this.disconnectWallet()
      });
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
      setContractProvider(provider)
      subscribeToEvents()
      this.subscribeToProviderEvents(provider)
    },
    getWalletInfo: function() {
      window.web3.eth.getCoinbase((err, coinbase) => {
        if (err) {
          console.error('Error: ', err)
        }
        if (coinbase !== null) {
          window.web3.eth.getBalance(coinbase, (err, balance) => {
            this.$store.dispatch('updateWallet', {coinbase, balance})
          })
        }
      })
    },
    disconnectWallet: function() {
      this.$store.dispatch('web3isConnected', false)
      this.$store.dispatch('updateWallet', {coinbase: null, balance: null})
      this.$store.dispatch('chainChanged', null)
    },
  }
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

  .web3modal-modal-card {
    margin-top: 150px;
  }
  
  /* BINANCE color #F0B90B */
  a {
        padding: 2px;
        color: #F0B90B;
    }
</style>
