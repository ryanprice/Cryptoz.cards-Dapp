<template>
  <div id="app-header" class="headerComponent">
    <b-navbar
      toggleable="lg"
      class="navbar navbar-expand-md navbar-dark fixed-top bg-dark"
    >
      <router-link id="cryptoz-logo" class="navbar-brand" to="/">
        <img class="logo-nav" src="./../assets/cryptokeeper_logo.svg" />
        Cryptoz
      </router-link>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav id="cryptoz-nav">
          <b-nav-item>
            <router-link to="/shop">Shop</router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link to="/crypt">Your Crypt</router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link to="/market">Markets</router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link to="/view/1">View</router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link to="/help">Help</router-link>
          </b-nav-item>
          <b-nav-item v-if="web3isConnected">
            <b-link href="#" v-b-modal.sponsor-modal>Sponsors</b-link>
          </b-nav-item>

          <b-modal
            v-if="web3isConnected"
            id="sponsor-modal"
            size="lg"
            title="Sponsor Link"
            hide-footer
          >
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
              <b-button v-on:click="copySponsorLink">
                Copy Link To Clipboard
              </b-button>
            </b-jumbotron>

            <b-jumbotron class="jumbo" lead="Link Your Sponsor">
              <p>
                By linking a sponsor with their wallet address, you will receive
                a
                <b>Free Platinum Sponsored Card!</b>
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
                    :disabled="!isSponsorValid"
                    v-on:click="linkSponsor"
                    >Link</b-button
                  >
                </b-input-group-append>
                <b-form-invalid-feedback id="input-live-feedback">
                  <div>Please enter a valid address.</div>
                </b-form-invalid-feedback>
              </b-input-group>
                <b-alert v-else variant="success" show
                  >You are already linked to sponsor.</b-alert
                >
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
                <img src="@/assets/ethereum-symbol.png" />
                {{ ethBalance.toFixed(4) }}
              </span>
            </li>
          </transition>

          <b-button
            id="connect-button"
            v-if="!web3isConnected"
            variant="primary"
            v-on:click="$emit('on-connect')"
          >
            Connect To Ethereum
          </b-button>
        </b-navbar-nav>
      </b-collapse>

      <div id="bonus-boosters">
        <div
          class="bonusClass"
          v-if="web3isConnected && bonusReady == 1 && showSpinner == false"
          v-on:click="GetBonus"
        >
          Claim 2 FREE Boosters !
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
      </div>
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
        process.env.NODE_ENV === "development"
          ? "localhost:8080"
          : "https://rinkeby.cryptoz.cards";
      return `${siteURL}?sponsor=${this.coinbase}`;
    },
    isSponsorValid() {
      return isAddress(this.sponsorAddress.toLowerCase());
    },
  },
  data() {
    return {
      pendingTransaction: 0,
      showSpinner: false,
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
    //first check if the dapp is authed and logged in
    //console.log('AppHeader mounted...')
    //this.setSubscriptions(); TOO EARLY FOR THIS :(
  },
  methods: {
    checkSponsor: async function(address) {
      const instance = await window.Cryptoz.deployed();
      const sponsors = await instance.sponsors.call(address);
      if (sponsors && sponsors !== baseAddress) {
        this.shouldShowSponsor = false;
      } else {
        if (this.$route.query.sponsor) {
          this.sponsorAddress = this.$route.query.sponsor;
          this.$bvModal.show("sponsor-modal");
        }
      }
    },
    linkSponsor: async function() {
      try {
        const instance = await window.Cryptoz.deployed();
        console.log(instance);
        const temp = await instance.sponsors.call(
          "0xdd3D015D0a541244699d7776222443538557523c"
        );
        const result = await instance.linkMySponsor(
          "0x69cfAbaD3678789FE33d3BEEc5d4c759Ec24595A",
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

.logo-nav {
  margin-right: 0.5em;
  width: 2em;
}

.wallet-nav {
  color: #d48b15;
  flex: 1;
  justify-content: center;
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
  position: absolute;
  right: 3rem;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
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
  position: absolute;
  right: 3rem;
}

#cryptoz-nav {
  /*
      this calc is to account for the boosters text on the right
      flex: 1; didnt work so I hacked it. This ensures the wallet
      info is centered between the main nav and the boosters text.
    */
  width: calc(100% - 150px - 3rem);
  display: flex;
  flex-direction: row;
  align-items: center;
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
</style>
