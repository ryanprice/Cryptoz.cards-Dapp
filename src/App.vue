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

import axios from 'axios';
var contract = require("truffle-contract");
import watchEvents from './util/watchEvents';
import { showSuccessToast } from './util/showToast'
import BodyContent from './components/BodyContent'
import AppHeader from './components/layout/AppHeader'
import AppFooter from './components/layout/AppFooter'
import _ from 'lodash'

// import BurnerConnectProvider from "@burner-wallet/burner-connect-provider";
import WalletConnectProvider from "@walletconnect/web3-provider";
const Web3 = require('web3')
// const Torus = require("@toruslabs/torus-embed");
// const Portis = require("@portis/web3");
// const Fortmatic = require("fortmatic");
import './main.css'

// import dev_cryptoz_artifacts from './dev/contracts/Cryptoz.json';
// import dev_cryptoz_token_artifacts from './dev/contracts/CzxpToken.json';

// import bsc_cryptoz_artifacts from'./bsc/contracts/Cryptoz.json';
// import bsc_cryptoz_token_artifacts from './bsc/contracts/CzxpToken.json';

const testEnv = true

// const providerOptions = {
  // torus: {
  //   package: Torus,
  // },
  // walletconnect: {
  //   package: WalletConnectProvider,
  //   options: {
  //     // infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
  //     rpc: {
  //       56: 'https://bsc-dataseed.binance.org/',
  //       97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  //     },
  //   },
  // },
  // burnerconnect: {
  //   package: BurnerConnectProvider,
  //   options: {
  //     defaultWallets: [
  //       { origin: "https://denver-demo.burnerfactory.com/", name: "Denver Demo Wallet" },
  //     ],
  //   },
  // },
  // portis: {
  //   package: Portis,
  //   options: {
  //     id: "1f9427a6-ceef-4d45-a6df-79f081e909d9",
  //   },
  // },
  // fortmatic: {
  //   package: Fortmatic,
  //   options: {
  //     key: process.env.NODE_ENV === 'production' ? "pk_live_6D8AC68104516C09" : "pk_test_2ED863FB3FCEB2F3",
  //   },
  // }
// }


const contractBaseUrl = `https://cryptoz.cards/services`

export default {
  name: 'App',
  components: {
    BodyContent,
    AppHeader,
    AppFooter
  },
  async created() {
    // set this here to be able to debounce it..
    // debounce prevents this from showing the "Balance Updated" twice
    // when both Cryptoz and Czxp contracts emit an event
    this.onBalanceUpdated = _.debounce(() => {
      showSuccessToast(this, 'Balance Updated!')
    }, 1000)

    // this needs to be set in beforeCreate because vue lifecycle
    // is Parent create -> child create -> child mount -> parent mount
    // and we need provider to be set in child components
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum)
      window.web3 = web3
      this.setContractProvider(web3.currentProvider)
    }
    else {
      console.log('non web3 browser detected')
    }
  },
  data() {
    return {
      wallet : '',
      wallet_balance : 0,
      network_name : 'Detecting Ethereum network..Loading',
      eth_network_name : '',
    }
  },
  computed: {
    coinbase() {
      return this.$store.state.web3.coinbase;
    },
    CryptozInstance() {
      return this.$store.state.contractInstance.cryptoz;
    },
    CzxpInstance() {
      return this.$store.state.contractInstance.czxp;
    },
  },
  watch: {
    coinbase(val, oldVal) {
      if (val && oldVal && val !== oldVal) {
        showSuccessToast(this, 'Successfully changed wallets.');
      }
      if (val) {
        watchEvents(this.CzxpInstance, this.CryptozInstance, {
          onCardMinted: this.onCardMinted,
          onBalanceUpdated: this.onBalanceUpdated,
        })
      }
    }
  },
  mounted() {
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
  methods: {
    onConnect: async function() {
      const provider = window.ethereum

      await provider.enable()
      const web3 = new Web3(provider)
      window.web3 = web3
      this.setContractProvider(provider)
      // const web3Modal = new Web3Modal({
      //   cacheProvider: true,
      //   providerOptions,
      // });

      // const provider = await web3Modal.connect()
      // await provider.enable()
      // this.setContractProvider(provider)
    },
    
    async setContractProvider(provider) {
      this.subscribeToProviderEvents(provider)

      const cryptozContractResp = await axios.get(`${contractBaseUrl}/Cryptoz.json`);
      const czxpContractResp = await axios.get(`${contractBaseUrl}/CzxpToken.json`)

      const CryptozContract = contract(cryptozContractResp.data);
      const CzxpContract = contract(czxpContractResp.data);

      CryptozContract.setProvider(provider)
      CzxpContract.setProvider(provider)
      const [cryptoz, czxp] = await Promise.all([CryptozContract.deployed(), CzxpContract.deployed()])

      await this.$store.dispatch('setContractInstance', { cryptoz, czxp })
      this.$store.dispatch('web3isConnected', true)
      this.$store.dispatch('updateUniverseBalances')

      await this.$store.dispatch('updateWallet')
      this.$store.dispatch('updateOwnerBalances')
    },

    onCardMinted({
      cardTypeId,
      editionNumber,
    }) {
      this.$store.dispatch('updateMintedCountForCard', { cardTypeId, editionNumber })
    },

    subscribeToProviderEvents(provider) {
      provider.on("connect", ({chainId}) => {
        this.$store.dispatch('web3isConnected', true)
        this.$store.dispatch('chainChanged', chainId)
      });
      provider.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          this.$store.dispatch('web3isConnected', true)
        }
        //user "locks" their wallet via provider
        else {
          this.disconnectWallet()
        }
      });
      provider.on("chainChanged", (chainId) => {
        // without this check it auto-reloads to infinity
        const previousChainId = localStorage.getItem('ethChainId')
        if (previousChainId !== chainId) {
          localStorage.setItem('ethChainId', chainId)
          window.location.reload()
          return
        }
      });
      provider.on("disconnect", () => {
        this.disconnectWallet()
      });
    },

    getWalletInfo() {
      this.$store.dispatch('updateWallet')
      this.$store.dispatch('updateOwnerBalances')
    },

    disconnectWallet() {
      this.$store.dispatch('web3isConnected', false)
      this.$store.dispatch('disconnectWallet')
      this.$store.dispatch('chainChanged', null)
    }
  }
}

</script>

<style>
  #app {
    min-height: 100vh;
    overflow-x: hidden;
  }

  .headerComponent{
    margin-bottom:2em;
  }
  
  .jumbotron{
    margin-top:4em;
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
