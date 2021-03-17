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
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav id="cryptoz-nav">
          <b-nav-item>
            <router-link v-bind:class="classObject" to="/shop">Shop</router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link v-bind:class="classObject" to="/crypt">Your NFT Crypt</router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link v-bind:class="classObject" to="/market">Markets</router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link v-bind:class="classObject" to="/view/1">View</router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link v-bind:class="classObject" to="/help">Help</router-link>
          </b-nav-item>
          <b-nav-item v-if="web3isConnected">
            <b-link v-bind:class="classObject" href="#" v-b-modal.sponsor-modal>Affiliate</b-link>
          </b-nav-item>

          <b-modal
            v-if="web3isConnected"
            id="sponsor-modal"
            size="lg"
            title="Sponsor Link"
            hide-footer
          >

            <b-jumbotron class="jumbo" lead="Link Your Sponsor">
              <p>
                By linking a sponsor with their wallet address, you will receive
                a
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
                ></b-form-input>
                <b-input-group-append>
                  <b-button
                    variant="success"
                    :disabled="!isSponsorValid || sponsorAddress === ''"
                    v-on:click="linkSponsor"
                    >Link</b-button
                  >
                </b-input-group-append>
                <div v-if="sponsorAddress !== ''">
                  <b-form-invalid-feedback v-if="notSameSponsorError">
                    <div>Please enter a valid address.</div>
                  </b-form-invalid-feedback>
                  <b-form-invalid-feedback v-else>
                    <div>You can't link your own wallet.</div>
                  </b-form-invalid-feedback>
                </div>
              </b-input-group>
                <b-alert v-else variant="success" show
                  >You are already linked to sponsor wallet.</b-alert
                >
            </b-jumbotron>
            
            <b-jumbotron
              id="sponsor-link-wrapper"
              class="jumbo"
              lead="Your Affiliate Link"
            >
              <p>Copy the link by clicking the button below.</p>
              <p>
                Send the link to your friends so they get a
                <b>Free Platinum Sponsored Card!</b>
              </p>
              <input
                ref="sponsor"
                id="sponsor-link"
                hidden
                :value="getSponsorRoute"
              />
              
              
              <a class="twitter-share-button" v-bind:href="getTweet" data-size="large">
                <b-button variant="primary" style="width:26%"><img style="width:30px" src="https://utilitypeopleuk.com/wp-content/uploads/2017/06/twitter-icon-circle-blue-logo-preview.png"> Tweet your link</b-button>
              </a>
              &nbsp;
              <b-button v-on:click="copySponsorLink">
                Copy Link To Clipboard
              </b-button>
              
            </b-jumbotron>
            
            
          </b-modal>

          <transition name="fade" mode="out-in">
            <li class="wallet-nav flex-row" v-if="web3isConnected">
              <div v-b-tooltip.hover :title="coinbase">
                <img src="@/assets/metamask-face.png" />
                {{ coinbase.substr(0, 6) + "..." + coinbase.substr(38) }}
              </div>
              <span
                v-b-tooltip.hover
                :title="ethBalance"
                class="wallet-balance"
              >
                <!--img v-if="this.$store.state.web3.chainId != 0x38 || this.$store.state.web3.chainId != 0x61" src="@/assets/ethereum-symbol.png" /-->
                <img src="@/assets/binance-coin-logo.webp" />
                {{ ethBalance.toFixed(4) }}
              </span>
            </li>
          </transition>

          <li id="connect-button">
            <b-button
              v-if="!web3isConnected"
              variant="primary"
              v-on:click="$emit('on-connect')"
              v-b-toggle.nav-collapse
            >
              Connect To Blockchain
            </b-button>
          </li>

          <li id="bonus-boosters">
            <div
              class="bonusClass"
              v-if="web3isConnected && bonusReady == 1 && showSpinner == false"
              v-on:click="GetBonus"
            >
              Claim 2 FREE Boosters!
            </div>
            <div v-else-if="web3isConnected && showSpinner == true">
              <img src="@/assets/spinner.gif" class="spinner" />
              <transition>
                <span class="spinner-text-style">{{ transactionMessage }}</span>
              </transition>
            </div>
            <div
              class="bonusClassNo"
              v-else-if="web3isConnected && bonusReady == 0 && showSpinner == false"
            >
              Your Next Bonus:<br /><strong> {{ timeToBonus }}</strong>
            </div>
          </li>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <p></p>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { showSuccessToast, showErrorToast } from "../../util/showToast";
import { isAddress } from "../../util/addressUtil";

const baseAddress = "0x0000000000000000000000000000000000000000";
export default {
  name: "AppHeader",
  beforeCreate() {
    //Initialize the app
    // console.log('registerWeb3 Action dispatched from AppHeader.vue')
    // this.$store.dispatch('registerWeb3')
  },
  computed: {
    classObject : function () { //Style the link colours
            //console.log("Hey bg ", this.$store.state.web3.chainId);
            if (this.$store.state.web3.chainId == 0x38 || this.$store.state.web3.chainId == 0x61) { //BNB 0x38/0x61
                return 'bsc-link';
            }else{
                return 'eth-link'; //ether bg
            }
    },
    ethBalance() {
      return parseFloat(web3.fromWei(this.$store.state.web3.balance), "ether");
    },
    coinbase() {
      return this.$store.state.web3.coinbase;
    },
    web3isConnected() {
      return (
        this.$store.state.web3.isConnected &&
        this.ethBalance !== null &&
        this.coinbase !== null
      );
    },
    currentEvent() {
      return this.$store.state.lastChainEvent;
    },
    getSponsorRoute() {
      console.log("Env: ", process.env.NODE_ENV)
      const siteURL =
        process.env.NODE_ENV == "development"
          ? "localhost:8080"
          : "https://bsc.cryptoz.cards";
      return `${siteURL}?sponsor=${this.coinbase}`;
    },
    getTweet() {
      return `https://twitter.com/intent/tweet?text=Click my%20sponsor%20link%20to%20 claim%20Your%20Free%20Platinum%20%23Cryptoz%20NFT%20Now!%0D%0A%0D%0A&hashtags=bsc,nft,nfts,NFTCommunity,nftcollectors,nftart,collectthecrypt&url=${this.getSponsorRoute}%0D%0A%0D%0A&related=CryptozNFT&via=CryptozNFT`;
    },
    isSponsorValid() {
      if (this.sponsorAddress === '') {
        return true
      }

      if (this.sponsorAddress.toLowerCase() === this.coinbase.toLowerCase()) {
        this.notSameSponsorError = false;
        return false;
      }

      this.notSameSponsorError = true;
      return isAddress(this.sponsorAddress.toLowerCase());
    },
  },
  data() {
    return {
      pendingTransaction: 0,
      showSpinner: false,
      notSameSponsorError: true,
      transactionMessage: "Pending confirmation...",
      showLogin: 1,
      bonusReady: 2,
      timeToBonus: 0,
      sponsorAddress: "",
      shouldShowSponsor: true,
    };
  },
  watch: {
    web3isConnected(newValue) {
      if (newValue) {
        this.checkSponsor(this.coinbase);
      }
    },
    ethBalance(newValue, oldValue) {
      console.log(
        `Updating ethBalance in header from ${oldValue} to ${newValue}`
      );
      // new wallet.. check their bonus and tell Owner balances to update
      if (newValue !== oldValue && newValue !== null) {
        //this.$store.dispatch('updateOwnerBalances')
        //this.$store.dispatch('updateUniverseBalances')
        //this.setSubscriptions();
      }
    },
    coinbase(newValue, oldValue) {
      console.log(
        `Updating coinbase in header from ${oldValue} to ${newValue}`
      );
      // new wallet.. check their bonus and tell Owner balances to update
      if (newValue !== oldValue && newValue !== null) {
        this.$store.dispatch("updateOwnerBalances");
        this.$store.dispatch("updateUniverseBalances");
        this.setSubscriptions();
      }
    },
    currentEvent(newValue, oldValue) {
      if (newValue !== oldValue && typeof newValue !== "undefined") {
        if (this.pendingTransaction == newValue.blockHash) {
          this.showSpinner = false;
          this.transactionMessage = "Confirmed! Balance updated";
          this.setSubscriptions();
        }
      }
    },
  },
  async mounted() {
  },
  methods: {
    checkSponsor: async function(address) {
      
      const instance = await window.Cryptoz.deployed();
      const sponsors = await instance.sponsors.call(address);
      console.log("checking sponsor..", sponsors);
      if (sponsors && sponsors !== baseAddress) {
        console.log("hey",this.$route.query.sponsor);
        this.shouldShowSponsor = false;
      } else {
      console.log("hey1",this.$route.query.sponsor);
        if (this.$route.query.sponsor) {
          this.sponsorAddress = this.$route.query.sponsor;
          this.$bvModal.show("sponsor-modal");
        }
      }
    },
    linkSponsor: async function() {
      try {
        const instance = await window.Cryptoz.deployed();
        const result = await instance.linkMySponsor(
          this.sponsorAddress,
          { from: this.coinbase }
        );
        console.log(result);
        showSuccessToast(this, "Sponsor linked!");
        this.$emit("LogSponsorLinked", [this.sponsorAddress, this.coinbase]);
      } catch (err) {
        console.log(err);
        showErrorToast(this, "Failed to link sponsor.");
      }
    },
    copySponsorLink: function() {
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
    setSubscriptions: function() {
      //Lets do a check for the Daily bonus'
      console.log("Check if the bonus is available for this playa..");
      //console.log(this.coinbase);
      //console.log(this.balance);

      window.Cryptoz.deployed()
        .then((instance) => {
          return instance.getTimeToDailyBonus(this.coinbase);
        })
        .then((res) => {
          //console.log('Time to next bonus is:');
          //console.log(res.c[0]*1000);
          var timeToBonusInMilli = res.c[0] * 1000;
          var now = new Date();
          //console.log('now is ' + now.getTime());

          if (now.getTime() >= timeToBonusInMilli) {
            this.bonusReady = 1; //Claim bonus state
          } else {
            this.bonusReady = 0; //countdown to bonus state
            this.timeToBonus = this.GetTimeString(res.c[0] * 1000);
          }
        });
    },
    GetBonus: function() {
      console.log("GetBonus called...");

      //change state to pending
      this.showSpinner = true;
      this.transactionMessage = "Pending confirmation...";

      window.Cryptoz.deployed()
        .then((instance) => {
          return instance.getBonusBoosters({
            from: this.coinbase,
            gas: 362000,
          });
        })
        .then((result) => {
          //change from pending to ready
          this.pendingTransaction = result.receipt.blockHash;
          this.transactionMessage = "Broadcast to chain...";
        })
        .catch((e) => {
          // Transaction rejected or failed
          //reset the claim tokens message
          this.showSpinner = false;
          this.transactionMessage = "Claim 2 FREE Boosters !";
        });
    },
    GetTimeString: function(_timeStamp) {
      var t = new Date(_timeStamp),
        hours = t.getHours(),
        min = t.getMinutes() + "",
        pm = false,
        months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

      if (hours > 11) {
        hours = hours - 12;
        pm = true;
      }

      if (hours == 0) hours = 12;
      if (min.length == 1) min = "0" + min;

      //return months[t.getMonth()] + ' ' + t.getDate() + ', ' + t.getFullYear() + ' ' + hours + ':' + min + ' ' + (pm ? 'pm' : 'am');
      return (
        months[t.getMonth()] +
        " " +
        t.getDate() +
        " at " +
        hours +
        ":" +
        min +
        " " +
        (pm ? "pm" : "am")
      );
    },
  },
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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

.wallet-nav {
  color: #d48b15;
  flex: 1;
  justify-content: center;
}

.wallet-nav > * {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.wallet-nav img {
  width: 30px;
}

li {
  margin-right: 1.2em;
}

a {
  padding: 2px;
}

/* BINANCE color #F0B90B */
.bsc-link {
  color: #F0B90B;
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

#bonus-boosters {
  height: 100%;
  min-width: 140px;
  display: flex;
  align-items: center;
}

#bonus-boosters:empty {
  display: none;
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

.flex-row {
  display: flex;
  flex-direction: row;
}

#connect-button {
  margin-left: auto;
  min-width: 190px;
}

#connect-button:empty {
  min-width: 0;
}

#cryptoz-nav {
  width: calc(100%);
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
}

.eth-link, .bsc-link {
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
}

.sponsor-warning {
  font-weight: bold;
  color: #dc3545;
}
.base-text{
    color:#FFFFFF;
}
</style>
