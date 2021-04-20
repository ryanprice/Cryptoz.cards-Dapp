<template>
  <div id="app-header" class="headerComponent">
    <b-navbar
      toggleable="lg"
      class="navbar navbar-expand-md navbar-dark fixed-top bg-dark"
    >
      <router-link id="cryptoz-logo" class="navbar-brand" to="/">
        <img class="logo-nav" src="./../assets/cryptokeeper_logo_binance.png" />
        Cryptoz
      </router-link>
      <b-navbar-toggle target="nav-collapse" />
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav id="cryptoz-nav">
          <b-nav-item id="shop">
            <router-link :class="classObject" to="/shop"> Shop </router-link>
          </b-nav-item>
          <b-nav-item id="crypt">
            <router-link :class="classObject" to="/my-cryptoz-nfts">
              Your NFT Crypt
            </router-link>
          </b-nav-item>
          <b-nav-item id="markets">
            <router-link :class="classObject" to="/market">
              Markets
            </router-link>
          </b-nav-item>
          <b-nav-item id="view">
            <router-link :class="classObject" to="/view/1"> View </router-link>
          </b-nav-item>
          <b-nav-item id="help">
            <router-link :class="classObject" to="/help"> Help </router-link>
          </b-nav-item>
          <b-nav-item v-if="isWalletConnected" id="affiliate">
            <b-link v-b-modal.sponsor-modal :class="classObject" href="#">
              Affiliate
            </b-link>
          </b-nav-item>
          <b-nav-item>
            <router-link :class="classObject" to="/data-indicators"
              ><b-icon-bar-chart-line-fill
            /></router-link>
          </b-nav-item>

          <li v-if="isWalletConnected" id="wallet-nav">
            <div
              id="wallet-id"
              v-b-tooltip.hover="{ customClass: 'tooltip-1' }"
              :title="coinbase"
            >
              <img src="@/assets/metamask-face.png" class="header-icon" />
              <span>{{
                coinbase.substr(0, 6) + "..." + coinbase.substr(38)
              }}</span>
            </div>
            <div
              id="wallet-balance"
              v-b-tooltip.hover="{ customClass: 'tooltip-2' }"
              :title="ethBalance"
            >
              <!--img v-if="this.$store.state.web3.chainId != 0x38 || this.$store.state.web3.chainId != 0x61" src="@/assets/ethereum-symbol.png" /-->
              <img src="@/assets/binance-coin-logo.webp" class="header-icon" />
              <span>{{ ethBalance.toFixed(4) }}</span>
            </div>
          </li>

          <li id="bonus-boosters">
            <div
              v-if="isWalletConnected && bonusReady && showSpinner == false"
              class="bonusClass"
              @click="GetBonus"
            >
              Claim 2 FREE Boosters!
            </div>
            <div v-else-if="isWalletConnected && showSpinner == true">
              <b-spinner
                style="width: 1.5rem; height: 1.5rem"
                type="grow"
                variant="light"
              />
              <transition>
                <span class="spinner-text-style">
                  {{ transactionMessage }}</span
                >
              </transition>
            </div>
            <div
              v-else-if="
                isWalletConnected &&
                !bonusReady &&
                timeToBonus &&
                showSpinner == false
              "
              class="bonusClassNo"
            >
              Your Next Bonus:<br /><strong> {{ timeToBonus }}</strong>
            </div>
          </li>

          <li id="connect-button">
            <b-button
              v-if="!isWalletConnected"
              v-b-toggle.nav-collapse
              variant="primary"
              @click="$emit('connect')"
            >
              Connect To Blockchain
            </b-button>
          </li>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-modal
      v-if="isWalletConnected"
      id="sponsor-modal"
      size="lg"
      title="Sponsor Link"
      hide-footer
    >
      <b-jumbotron class="jumbo" :lead="sponsorTitle">
        <p>
          By linking your sponsor's wallet address, you will mint a
          <b>Free Platinum Sponsored NFT Card!</b>
        </p>
        <p class="sponsor-warning" variant="info">
          Note: You can only link sponsor once
        </p>
        <b-input-group v-if="shouldShowSponsor" size="lg">
          <b-form-input
            v-model="sponsorAddress"
            :state="isSponsorValid"
            required
            type="text"
            placeholder="Enter Address"
          />
          <b-input-group-append>
            <b-button
              variant="success"
              :disabled="!isSponsorValid || sponsorAddress === ''"
              @click="linkSponsor"
            >
              Link
            </b-button>
          </b-input-group-append>
          <div v-if="sponsorAddress !== ''">
            <b-form-invalid-feedback v-if="!isSponsorValid">
              <div>Please enter a valid address.</div>
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-if="isSameSponsor">
              <div>You can't link your own wallet.</div>
            </b-form-invalid-feedback>
          </div>
        </b-input-group>
        <b-alert v-else variant="success" show>
          You are already linked to sponsor wallet.
        </b-alert>
      </b-jumbotron>

      <div class="platinum-card" v-if="queryHasSponsor && !showShareMyLink">
        <b-jumbotron class="platinum-jumbotron">
          <div class="platinum-card-wrapper">
            <img src="../assets/cryptoz_card_platinum.svg" />
            <span class="question-mark">?</span>
          </div>
        </b-jumbotron>
      </div>

      <b-jumbotron
        id="sponsor-link-wrapper"
        class="jumbo"
        lead="Your Affiliate Link"
        v-else
      >
        <p>
          Automatically earn CZXP
          <img
            class="czxp-logo"
            src="../assets/cryptokeeper_coin_binance.svg"
            align="middle"
          />
          Token rewards from your affiliate network
        </p>
        <p>Copy the link by clicking the button below.</p>
        <p>
          Send the link to your friends so they can mint a
          <b>Free Platinum Sponsored Card!</b>
        </p>
        <input
          id="sponsor-link"
          ref="sponsor"
          hidden
          :value="getSponsorRoute"
        />
        <div class="button-wrapper">
          <a :href="getTweet" data-size="large">
            <b-button variant="primary" class="affiliate-button"
              ><img
                style="width: 30px"
                src="https://utilitypeopleuk.com/wp-content/uploads/2017/06/twitter-icon-circle-blue-logo-preview.png"
              />
              Tweet your link</b-button
            >
          </a>
          <b-button class="affiliate-button" @click="copySponsorLink">
            Copy Link To Clipboard
          </b-button>
        </div>
      </b-jumbotron>

      <div class="prev-next-buttons" v-if="queryHasSponsor">
        <b-button
          :style="{ visibility: showShareMyLink ? 'visible' : 'hidden' }"
          size="lg"
          variant="link"
          @click="previousSponsorModalAction"
          >Previous</b-button
        >
        <b-button
          @click="nextSponsorModalAction"
          :style="{ visibility: showShareMyLink ? 'hidden' : 'visible' }"
          size="lg"
          variant="link"
          >Skip</b-button
        >
      </div>
    </b-modal>
    <p />
  </div>
</template>

<script>
import { showSuccessToast, showErrorToast } from "../../util/showToast";
import { isAddress } from "../../util/addressUtil";
import moment from "moment";
import dAppStates from "@/dAppStates";
import {
  BNavbar,
  BNavbarToggle,
  BCollapse,
  BNavbarNav,
  BNavItem,
  BLink,
  BButton,
  BModal,
  BJumbotron,
  BInputGroup,
  BFormInput,
  BInputGroupAppend,
  BFormInvalidFeedback,
  BAlert,
} from "bootstrap-vue";

const baseAddress = "0x0000000000000000000000000000000000000000";
export default {
  name: "AppHeader",
  components: {
    BNavbar,
    BNavbarToggle,
    BCollapse,
    BNavbarNav,
    BNavItem,
    BLink,
    BButton,
    BModal,
    BJumbotron,
    BInputGroup,
    BFormInput,
    BInputGroupAppend,
    BFormInvalidFeedback,
    BAlert,
  },
  emits: ["connect"],
  data() {
    return {
      pendingTransaction: 0,
      showSpinner: false,
      notSameSponsorError: true,
      transactionMessage: "Pending confirmation...",
      showLogin: 1,
      bonusReady: false,
      timeToBonus: 0,
      sponsorAddress: "",
      shouldShowSponsor: true,
      mySponsor: null,
      queryHasSponsor: false,
      showShareMyLink: false,
    };
  },
  computed: {
    classObject: function () {
      //Style the link colours
      const chainId = this.$store.state.web3.chainId;
      switch (chainId) {
        case 0x38:
        case 0x61:
          return "bsc-link";
        default:
          return "eth-link";
      }
    },
    CryptozInstance() {
      return this.$store.state.contractInstance.cryptoz;
    },
    dAppState() {
      return this.$store.state.dAppState;
    },
    isWalletConnected() {
      return this.$store.state.dAppState === dAppStates.WALLET_CONNECTED;
    },
    ethBalance() {
      const balance = this.$store.state.web3.balance;
      if (balance !== null) {
        return parseFloat(web3.utils.fromWei(balance.toString()));
      }
      return null;
    },
    coinbase() {
      return this.$store.state.web3.coinbase;
    },
    currentEvent() {
      return this.$store.state.lastChainEvent;
    },
    getSponsorRoute() {
      console.log("Env: ", process.env.NODE_ENV);
      const siteURL =
        process.env.NODE_ENV == "development"
          ? "localhost:8080"
          : "https://bsc.cryptoz.cards";
      return `${siteURL}?sponsor=${this.coinbase}`;
    },
    sponsorTitle() {
      return this.mySponsor
        ? `My Sponsor is ${this.mySponsor}`
        : "Link Your Sponsor";
    },
    getTweet() {
      return `https://twitter.com/intent/tweet?text=Click%20my%20sponsor%20link%20to%20claim%20Your%20Free%20Platinum%20%23Cryptoz%20NFT%20Now!%0D%0A%0D%0A&hashtags=bsc,nft,cryptozfam,NFTCommunity,nftcollectors,nftart,cryptoart&url=${this.getSponsorRoute}%0D%0A%0D%0A&related=CryptozNFT&via=CryptozNFT`;
    },
    isSponsorValid() {
      if (this.sponsorAddress === "") {
        return true;
      }

      if (this.sponsorAddress.toLowerCase() === this.coinbase.toLowerCase()) {
        return false;
      }

      return isAddress(this.sponsorAddress.toLowerCase());
    },
    isSameSponsor() {
      return this.sponsorAddress.toLowerCase() === this.coinbase.toLowerCase();
    },
  },
  watch: {
    isWalletConnected(value) {
      if (value) {
        this.checkSponsor(this.coinbase);
      }
    },
    currentEvent(newValue, oldValue) {
      if (newValue !== oldValue && typeof newValue !== "undefined") {
        if (this.pendingTransaction == newValue.blockHash) {
          this.showSpinner = false;
          this.transactionMessage = "Confirmed! Balance updated";
        }
        this.getDailyBonusTime();
      }
    },
    coinbase(value) {
      this.getDailyBonusTime();
      if (value) {
        this.checkSponsor(value);
      }
    },
    $route(to) {
      if (!to.query.sponsor) {
        this.queryHasSponsor = false;
        this.sponsorAddress = "";
      }
    },
  },
  mounted() {
    this.getDailyBonusTime();
  },
  methods: {
    nextSponsorModalAction: function () {
      this.showShareMyLink = true;
    },
    previousSponsorModalAction: function () {
      this.showShareMyLink = false;
    },
    checkSponsor: async function (address) {
      if (this.CryptozInstance && address) {
        const sponsor = await this.CryptozInstance.methods
          .sponsors(address)
          .call();
        this.mySponsor = parseInt(sponsor, 16) ? sponsor : null;
        if (sponsor && sponsor !== baseAddress) {
          this.shouldShowSponsor = false;
        } else {
          if (this.$route.query.sponsor) {
            this.sponsorAddress = this.$route.query.sponsor;
            this.queryHasSponsor = true;
            this.$bvModal.show("sponsor-modal");
          }
        }
      }
    },
    linkSponsor: async function () {
      this.$store.dispatch("setIsTransactionPending", true);
      const result = await this.CryptozInstance.methods
        .linkMySponsor(this.sponsorAddress)
        .send({ from: this.coinbase }, (err, transactionHash) => {
          this.$store.dispatch("setIsTransactionPending", false);
        })
        .catch((err) => {
          if (err.code !== 4001) {
            console.log(err);
            showErrorToast(this, "Failed to link sponsor.");
          }
        });

      if (result) {
        showSuccessToast(this, "Sponsor linked!");
        this.shouldShowSponsor = false;
        this.mySponsor = this.sponsorAddress;
        this.nextSponsorModalAction();
      }
    },
    copySponsorLink: function () {
      const textToCopy = this.$refs.sponsor.value;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          showSuccessToast(this, "Link Copied.");
        })
        .catch((error) => {
          console.log("Copy Failed: ", error);
        });
    },
    getDailyBonusTime: async function () {
      if (this.CryptozInstance && this.coinbase) {
        const res = await this.CryptozInstance.methods
          .getTimeToDailyBonus(this.coinbase)
          .call();

        var timeOfNextBonusInMilli = parseInt(res) * 1000;
        var now = new Date();

        if (now.getTime() >= timeOfNextBonusInMilli) {
          this.bonusReady = true; //Claim bonus state
        } else {
          this.bonusReady = false;
          this.timeToBonus = this.GetTimeString(timeOfNextBonusInMilli);
        }
      }
    },
    GetBonus: async function () {
      this.showSpinner = true;
      this.transactionMessage = "Pending confirmation...";
      this.$store.dispatch("setIsTransactionPending", true);

      const result = await this.CryptozInstance.methods
        .getBonusBoosters()
        .send({ from: this.coinbase }, (err, transactionHash) => {
          this.pendingTransaction = transactionHash;
          if (err) {
            this.showSpinner = false;
            this.transactionMessage = "Claim 2 FREE Boosters!";
          } else {
            this.transactionMessage = "Broadcast to chain...";
          }
          this.$store.dispatch("setIsTransactionPending", false);
        })
        .catch((e) => {
          this.showSpinner = false;
          this.transactionMessage = "Claim 2 FREE Boosters!";
        });

      this.showSpinner = false;
      if (result) {
        this.getDailyBonusTime();
      }
    },
    GetTimeString: function (_timeStamp) {
      return moment(_timeStamp).format("MMM D, h:mm a");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.navbar {
  max-width: 100vw;
}

.button-wrapper {
  display: flex;

  @media (max-width: 500px) {
    flex-direction: column;
  }

  .affiliate-button {
    height: 40px;
    margin-right: 16px;

    @media (max-width: 500px) {
      width: 100%;
      margin-top: 16px;
    }
  }

  a {
    padding: 0;
  }
}

.prev-next-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 18px;

  button {
    color: #f0b90b;
  }
}

.platinum-card {
  margin-top: 0px;
  display: flex;
  justify-content: center;
}

.platinum-card-wrapper {
  position: relative;
  img {
    width: 300px;

    @media screen and (max-width: 400px) {
      width: 200px;
    }
  }

  .question-mark {
    font-size: 7rem;
    font-weight: bold;
    color: white;
    position: absolute;
    top: 17%;
    left: 43%;

    @media screen and (max-width: 400px) {
      top: 10%;
      left: 40%;
    }
  }
}

#cryptoz-nav {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
}

#bonus-boosters {
  min-width: 140px;
  display: flex;
  align-items: center;
  grid-row: 1;
}

#bonus-boosters:empty {
  height: 0;
  min-width: 0;
  width: 0;
}

#wallet-nav:empty {
  height: 0;
}

#wallet-nav {
  display: flex;
  flex: 1;
  grid-row: 2;
  justify-content: center;
  height: 40px;
  align-items: center;
}

#wallet-id {
  color: #d48b15;
  display: flex;
  justify-content: center;
  margin-right: 20px;
}

#wallet-balance {
  display: flex;
  color: #90ee90;
}

.platinum-jumbotron {
  margin-top: 0 !important;
}

.bonusClass {
  animation: shake 3.82s infinite cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
  color: #00ff00;
  margin-right: 0.8em;
  cursor: pointer;
  padding: 1px;
  border: 1px solid transparent;
}

.tooltip-1 {
  top: 65px !important;
}

.tooltip-2 {
  top: 45px !important;
}

@media screen and (max-width: 600px) {
  #cryptoz-nav {
    display: grid;
    grid-template-rows: repeat(8, auto);
  }

  .nav-item {
    height: 40px;
    display: flex;
    align-items: center;
  }

  #bonus-boosters {
    height: 50px;
    justify-content: center;
    margin: 0;
  }

  .bonusClass {
    text-align: center;
    margin-right: 0;
  }

  #connect-button {
    margin: auto;
  }

  #shop {
    position: relative;
    margin-top: 10px;
  }

  #shop:before {
    content: "";
    height: 1px;
    background: gray;
    position: absolute;
    top: -5px;
    left: 10px;
    right: 10px;
  }

  .tooltip-1 {
    top: 0 !important;
  }

  .tooltip-2 {
    top: 0 !important;
  }
}

#cryptoz-logo {
  margin-right: 3rem;
}

.router-link-active {
  color: #ffffff;
}

.mm-header {
  color: #fff;
  text-align: right;
  margin-right: 10px;
  width: 23em;
}

#nav-collapse {
  overflow-x: auto;
}

.logo-nav {
  margin-right: 0.5em;
  width: 2em;
}

li {
  margin-right: 1.2em;
}

a {
  padding: 2px;
}

/* BINANCE color #F0B90B */
.bsc-link {
  color: #f0b90b;
}

a:hover {
  color: #fff;
  text-decoration: none;
  transform: scale(1.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.bonusClass:hover {
  animation: none;
  color: white;
  margin-right: 0.8em;
  cursor: pointer;
  padding: 1px;
}

.bonusClassNo {
  color: #f7162c;
}

.bonusClassLogIn {
  color: #ffff00;
  margin-right: 3.2em;
}
.wallet-balance {
  color: lightgreen;
  margin: 0 4em 0 1em;
}

.header-icon {
  height: 20px;
  margin-right: 5px;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

#connect-button {
  margin-left: auto;
  min-width: 190px;
  grid-row: 3;
}

#connect-button:empty {
  min-width: 0;
}

.eth-link,
.bsc-link {
  white-space: nowrap;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
.spinner {
  width: 2em;
}
.spinner-text-style {
  color: #fff;
}

.jumbo {
  margin-top: 0 !important;
  padding: 10px 10px;
  margin-bottom: 50px;
}

.lead {
  font-size: 1.5rem !important;
  font-weight: 600 !important;
  word-break: break-all;
}

.sponsor-warning {
  font-weight: bold;
  color: #dc3545;
}
.base-text {
  color: #ffffff;
}

.czxp-logo {
  width: 20px;
  vertical-align: middle;
}
</style>
