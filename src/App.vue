<template>
  <div id="app">
    <AppHeader @connect="handleConnect" />
    <transition name="component-fade" mode="out-in">
      <router-view />
    </transition>
    <CzxpRewardEffect />
    <AppFooter />
    <transaction-modal />
  </div>
</template>

<script>
import axios from "axios";
import debounce from "lodash/debounce";
import watchEvents from "./util/watchEvents";
import { showSuccessToast } from "./util/showToast";
import AppHeader from "./components/layout/AppHeader";
import AppFooter from "./components/layout/AppFooter";
import TransactionModal from "./components/TransactionModal.vue";
import dAppStates from "@/dAppStates";
import { MessageBus } from "@/messageBus";
import CzxpRewardEffect from "./components/layout/CzxpRewardEffect";

// import BurnerConnectProvider from "@burner-wallet/burner-connect-provider";
// import WalletConnectProvider from "@walletconnect/web3-provider";
const Web3 = require("web3");
// const Torus = require("@toruslabs/torus-embed");
// const Portis = require("@portis/web3");
// const Fortmatic = require("fortmatic");
import "./main.css";

// import dev_cryptoz_artifacts from './dev/contracts/Cryptoz.json';
// import dev_cryptoz_token_artifacts from './dev/contracts/CzxpToken.json';

// import bsc_cryptoz_artifacts from'./bsc/contracts/Cryptoz.json';
// import bsc_cryptoz_token_artifacts from './bsc/contracts/CzxpToken.json';

const testEnv = true;

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

const contractBaseUrl = `https://cryptoz.cards/services`;

export default {
  name: "App",
  components: {
    AppHeader,
    AppFooter,
    TransactionModal,
    CzxpRewardEffect,
  },
  data() {
    return {
      wallet: "",
      wallet_balance: 0,
      network_name: "Detecting Ethereum network..Loading",
      eth_network_name: "",
    };
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
        showSuccessToast(this, "Successfully changed wallets.");
      }
    },
  },
  async created() {
    // set this here to be able to debounce it..
    // debounce prevents this from showing the "Balance Updated" twice
    // when both Cryptoz and Czxp contracts emit an event
    this.onBalanceUpdated = debounce(() => {
      showSuccessToast(this, "Balance Updated!");
    }, 1000);

    // this needs to be set in beforeCreate because vue lifecycle
    // is Parent create -> child create -> child mount -> parent mount
    // and we need provider to be set in child components
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      window.web3 = web3;
      this.initializeApp();
    } else {
      console.log("non web3 browser detected");
    }
    MessageBus.$on("connect", () => {
      this.handleConnect();
    });
  },
  mounted() {
    // Twitter library - footer follow button uses it
    window.twttr = (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
      if (d.getElementById(id)) return t;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);

      t._e = [];
      t.ready = function (f) {
        t._e.push(f);
      };

      return t;
    })(document, "script", "twitter-wjs");
  },
  methods: {
    initializeApp: async function () {
      const [accounts, networkId] = await Promise.all([
        web3.eth.getAccounts(),
        web3.eth.net.getId(),
      ]);
      this.$store.dispatch("chainChanged", networkId);
      await this.loadContracts(accounts, networkId);
      this.$store.dispatch("setDAppState", dAppStates.CONNECTED);
      this.subscribeToProviderEvents(web3.currentProvider);
      this.$store.dispatch("updateUniverseBalances");
      if (accounts.length > 0) {
        await this.$store.dispatch("updateOwnerBalances");
        this.$store.dispatch("setDAppState", dAppStates.WALLET_CONNECTED);

        watchEvents(this.CzxpInstance, this.CryptozInstance, {
          onCardMinted: this.onCardMinted,
          onBalanceUpdated: this.onBalanceUpdated,
          onSponsorEvent: (czxpReward) => {
            MessageBus.$emit("czxpReward", czxpReward);
          },
        });
      }
    },
    loadContracts: async function (accounts, networkId) {
      const cryptozContractResp = await axios.get(
        `${contractBaseUrl}/Cryptoz.json`
      );
      const czxpContractResp = await axios.get(
        `${contractBaseUrl}/CzxpToken.json`
      );
      const cryptozArtifact = cryptozContractResp.data;
      const czxpArtifact = czxpContractResp.data;
      const cryptozContractAddress =
        cryptozArtifact.networks[networkId].address;
      const czxpContractAddress = czxpArtifact.networks[networkId].address;
      const cryptozContract = new web3.eth.Contract(
        cryptozArtifact.abi,
        cryptozContractAddress
      );
      const czxpContract = new web3.eth.Contract(
        czxpArtifact.abi,
        czxpContractAddress
      );
      return this.$store.dispatch("setContractInstance", {
        cryptoz: cryptozContract,
        czxp: czxpContract,
      });
    },
    handleConnect: async function () {
      const provider = window.ethereum;

      await provider.request({ method: "eth_requestAccounts" });
      const web3 = new Web3(provider);
      window.web3 = web3;
      this.initializeApp();
      // const web3Modal = new Web3Modal({
      //   cacheProvider: true,
      //   providerOptions,
      // });

      // const provider = await web3Modal.connect()
      // await provider.enable()
      // this.setContractProvider(provider)
    },
    onCardMinted({ cardTypeId, editionNumber }) {
      this.$store.dispatch("updateMintedCountForCard", {
        cardTypeId,
        editionNumber,
      });
    },

    subscribeToProviderEvents(provider) {
      provider.on("connect", ({ chainId }) => {
        this.$store.dispatch("chainChanged", chainId);
        this.$store.dispatch("setDAppState", dAppStates.CONNECTED);
      });
      provider.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          await this.$store.dispatch("updateOwnerBalances");
          this.$store.dispatch("setDAppState", dAppStates.WALLET_CONNECTED);
        }
        //user "locks" their wallet via provider
        else {
          this.disconnectWallet();
          this.$store.dispatch("setDAppState", dAppStates.CONNECTED);
        }
      });
      provider.on("chainChanged", (chainId) => {
        this.$store.dispatch("chainChanged", chainId);
        // without this check it auto-reloads to infinity
        const previousChainId = localStorage.getItem("ethChainId");
        if (previousChainId !== chainId) {
          localStorage.setItem("ethChainId", chainId);
          window.location.reload();
          return;
        }
      });
      provider.on("disconnect", () => {
        this.disconnectWallet();
        this.$store.dispatch("setDAppState", dAppStates.NOT_CONNECTED);
      });
    },
    disconnectWallet() {
      this.$store.dispatch("disconnectWallet");
      this.$store.dispatch("chainChanged", null);
    },
  },
};
</script>

<style>
#app {
  min-height: 100vh;
  overflow-x: hidden;
}
.jumbotron {
  margin-top: 4em;
}
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
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
  color: #f0b90b;
}
</style>
