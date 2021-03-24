<template>
  <div>
    <!-- Open Booster Modal -->
    <b-modal
      id="open-booster-modal"
      title="Enter a CZXP burn wager amount to increase the odds of pulling a rare or epic card ( czxp gone forever ):"
      ok-variant="danger"
      ok-title="Open Booster"
      hide-footer
    >
      <div>Enter 0 for no wager</div>
      <div>
        <b>To wager:</b> Minimum = 2,000,000,000, Maximum =
        1,649,267,441,667,000
      </div>
      <router-link to="/help?read-cards">Random odds explained</router-link>
      <b-form-input
        class="form-control"
        :state="isWagerValid"
        required
        type="number"
        v-model="wagerAmount"
      ></b-form-input>
      <b-form-invalid-feedback v-if="!notEnoughWager">
        <div>
          You need to enter a number between 2,000,000,000 and
          1,649,267,441,667,000 to wager.
        </div>
      </b-form-invalid-feedback>
      <b-form-invalid-feedback v-if="notEnoughWager">
        <div>You do not have enough CZXP tokens</div>
      </b-form-invalid-feedback>
      <b-row>
        <b-col>
          <b-button
            class="mt-3"
            variant="danger"
            v-b-tooltip.hover="'Open Booster'"
            block
            @click="openBooster"
            :disabled="!isWagerValid"
            >Mint random NFT</b-button
          >
        </b-col>
        <b-col>
          <b-button
            class="mt-3"
            block
            @click="$bvModal.hide('open-booster-modal')"
            >Cancel</b-button
          >
        </b-col>
      </b-row>
    </b-modal>

    <div class="jumbotron">
      <UniverseBalances></UniverseBalances>

      <h1>Your NFT Wallet</h1>
      <p>
        This is where all your NFT Cryptoz tokens can be accessed. Sort, search,
        gift and sacrifice. Sacrificing is permanent, not only in your wallet
        but across the entire Cryptoz Universe. That unique NFT is burned
        forever.
      </p>

      <!-- Loads cards here -->
      <div class="row">
        <div class="col">
          <b-button
            v-b-tooltip.hover="'Mint 1 random booster NFT'"
            class="btn btn-danger"
            v-bind:disabled="boostersOwned < 1"
            v-on:click="openBooster"
            >Open <b-icon-lightning-fill /> Booster Card
          </b-button>
        </div>
        <div class="col buy-and-open-booster">
          <b-button
            v-b-tooltip.hover="'Mint 1 random booster NFT +120 CZXP'"
            class="btn btn-danger"
            v-bind:disabled="web3.balance < 2000000000000000"
            v-on:click="buyAndOpenBooster"
            >Buy and Open <b-icon-lightning-fill /> Booster 0.002 BNB
          </b-button>
        </div>
      </div>
      <br />

      <OwnerBalances></OwnerBalances>
      <div class="cards-wrapper">
        <cards-container :isOthersCrypt="false" :addressToLoad="coinbase"></cards-container>
      </div>
    </div>
  </div>
</template>

<script>
import OwnedCardContent from "@/components/OwnedCardContent.vue";
import UniverseBalances from "@/components/UniverseBalances.vue";
import OwnerBalances from "@/components/OwnerBalances.vue";
import SortDropdown from "@/components/SortDropdown.vue";
import {
  showPendingToast,
  showRejectedToast,
  showSuccessToast,
} from "../util/showToast";
import CardsContainer from './CardsContainer.vue';

export default {
  name: "CryptContent",
  components: {
    OwnedCardContent,
    UniverseBalances,
    OwnerBalances,
    SortDropdown,
    CardsContainer
  },
  data() {
    return {
      wagerAmount: 0,
      receivingWallet: "",
      notEnoughWager: false,
    };
  },
  computed: {
    web3() {
      return this.$store.state.web3;
    },
    coinbase() {
      return this.$store.state.web3.coinbase;
    },
    boostersOwned() {
      return this.$store.state.boostersOwned;
    },
    isWagerValid() {
      const wagerAmount = parseInt(this.wagerAmount);
      this.notEnoughWager = false;

      if (wagerAmount === 0) {
        return true;
      }

      if (this.czxp_balance < wagerAmount) {
        this.notEnoughWager = true;
        return false;
      }

      return wagerAmount >= 2000000000 && wagerAmount <= 1649267441667000;
    },
    czxp_balance() {
      return this.$store.state.czxpBalance;
    },
    getMyCryptLink() {
      const url = process.env.NODE_ENV == "development" ? "localhost:8080" : "https://bsc.cryptoz.cards";
      return `${url}/my-cryptoz-nfts/${this.coinbase}`;
    }
  },
  watch: {
    web3: {
      handler(val, oldVal) {
        if (val.coinbase !== oldVal.coinbase) {
          this.$bvModal.hide("gift-modal");
          this.$bvModal.hide("open-booster-modal");
        }
      },
      deep: true,
    },
  },
  methods: {
    buyAndOpenBooster: async function() {
      try {
        showPendingToast(this);
        const instance = await window.Cryptoz.deployed();
        const res = await instance.buyBoosterCardAndOpen({
            from: this.coinbase,
            value: 2000000000000000,
          });
        this.$bvModal.hide("open-booster-modal");
        this.$store.dispatch("updateWallet");
        showSuccessToast(this, "Booster opened!")
      } catch (error) {
        console.error(error.message);
        showRejectedToast(this);
      }
    },
    openBooster: function() {
      console.log("Wagering.." + this.wagerAmount);

      //Change buy button to pending.. or show some pending state
      showPendingToast(this);
      var self = this;

      this.$bvModal.hide("open-booster-modal");

      window.Cryptoz.deployed()
        .then(function(instance) {
          return instance.openBoosterCard(0, { from: self.coinbase });
        })
        .then((res) => {
          if (res === undefined) {
            throw new Error("result is undefined in openBooster");
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.code === 4001) {
            showRejectedToast(self);
          }
        })
        .finally(() => {
          this.$store.dispatch("updateWallet");
        });
    },
  },
};

/*
  Ok we need to track the state of the Crypt
  LoggedIn true or false
  ownsCards true or false
  Sorted By
    Name
    Date Type loaded
    Limited Edition
*/
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.jumbotron {
  margin: auto;
  width: 95%;
}
.spinner {
  width: 2em;
}

.spinner-wrapper {
  display: flex;
  margin: 0px 8px;
}

.buy-and-open-booster {
  display: flex;
}

table .cell {
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

#button-container {
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  width: 100%;
}

#view-change-button {
  margin-left: 0.5rem;
}

.sacrifice-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-left: 1.2rem;
}

.emoji {
  font-size: 18px;
}

.card-bg {
  padding: 2px;
}

.card-bg-6 {
  background-color: rgba(84, 81, 97, 0.5);
  border: 2px solid rgb(84, 81, 97);
}

.card-bg-5 {
  background-color: rgba(43, 164, 250, 0.5);
  border: 2px solid rgb(43, 164, 250);
}

.card-bg-4 {
  background-color: rgba(202, 60, 44, 0.5);
  border: 2px solid rgb(202, 60, 44);
}

.card-bg-3 {
  background-color: rgba(87, 69, 229, 0.5);
  border: 2px solid rgb(87, 69, 229);
}

#open-booster-modal div {
  margin-bottom: 10px;
}

.crypt-actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.primary-actions {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.my-crypt-button {
  width: 300px;
  margin-bottom: 16px;
}

.cards-wrapper {
  margin-top: 24px;
}

/*plat and diamond borders*/
/*
  .card-bg-2{
  }

  .card-bg-1{
  }
  */

@media only screen and (min-width: 1000px) {
  #button-container {
    flex-direction: row;
    justify-content: space-between;
  }
  .crypt-actions {
    flex-direction: row;
    justify-content: initial;
    align-items: flex-start;
  }

  .my-crypt-button {
    width: 300px;
    margin-bottom: 0;
    margin-right: 16px;
  }
}
</style>
