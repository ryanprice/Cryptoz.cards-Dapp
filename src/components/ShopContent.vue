<template>
  <div>
    <b-modal
      id="buy-boosters-modal"
      title="Buy Booster Credits @ 0.002E each"
      hide-footer
    >
      <h5 class="modal-title">Booster cards will never be sold in the shop</h5>
      Enter the number of booster credits you would like to purchase:
      <b-row>
        <b-col cols="4">
          <input
            id="toWallet"
            class="form-control"
            type="text"
            v-on:input="totalCreditsToBuy = $event.target.value"
            value="1"
            required
          />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button class="mt-3" variant="danger" block @click="buyBoosters"
            >Buy Credits
          </b-button>
        </b-col>
        <b-col>
          <b-button
            class="mt-3"
            variant="secondary"
            block
            @click="$bvModal.hide('buy-boosters-modal')"
            >Cancel
          </b-button>
        </b-col>
      </b-row>
    </b-modal>

    <!--main role="main" class="container"-->
    <div class="jumbotron">
      <p>
        <UniverseBalances></UniverseBalances>
      </p>
      <h1>Shop</h1>
      <p>
        The Shop is a place to mint limited edition Cryptoz Cards. Some cards
        are free, some have a cost. You may also buy and open a booster card,
        which will randomly mint an unlimited edition card
      </p>
      <p>
        To Claim a FREE card Or buy a Limited edition card, you will need the
        required minimum balance of CZXP tokens
      </p>
      <div class="row">
        <div class="col">
          <!--button class="btn btn-danger" v-bind:disabled="buyBoostBtnOn == 0" data-toggle="modal" data-target="#buyBoostersPanel">Buy Booster Credits @ 0.002E
              </button-->
          <b-button
            class="btn btn-danger"
            v-bind:disabled="buyBoostBtnOn == 0 || balance < 2000000000000000"
            v-b-modal.buy-boosters-modal
            >Buy Booster Credits @ 0.002E</b-button
          >
          <transition name="fade">
            <span v-if="showSpinner == 1">
              <img src="@/assets/spinner.gif" class="spinner" />
              <strong>{{ transactionStatus }}</strong>
            </span>
          </transition>
        </div>
      </div>
      <br />

      <OwnerBalances></OwnerBalances>

      <br />
      <div class="row">
        <div class="col text-left">
          <b-dropdown id="dropdown" text="Sort By">
            <b-dropdown-item @click="sortByName('name')">Name</b-dropdown-item>
            <b-dropdown-item @click="sortByAttr('rarity')"
              >Rarity</b-dropdown-item
            >
            <b-dropdown-item @click="sortByAttr('cost')">Cost</b-dropdown-item>
            <b-dropdown-item @click="sortByAttr('card_set')"
              >Card Set</b-dropdown-item
            >
            <b-dropdown-item @click="sortByAttr('edition_total')"
              >Edition Total</b-dropdown-item
            >
            <b-dropdown-item @click="sortByAttr('card_level')"
              >Level</b-dropdown-item
            >
            <b-dropdown-item @click="sortByAttr('unlock_czxp')"
              >Unlock CZXP</b-dropdown-item
            >
            <b-dropdown-item @click="sortByAttr('buy_czxp')"
              >Buy CZXP</b-dropdown-item
            >
            <b-dropdown-item @click="sortByAttr('transfer_czxp')"
              >Transfer CZXP</b-dropdown-item
            >
            <b-dropdown-item @click="sortByAttr('sacrifice_czxp')"
              >Sacrifice CZXP</b-dropdown-item
            >
          </b-dropdown>
        </div>
      </div>
      <br />
      <div class="row">
        <OwnedCardContent
          v-for="card in storeCards"
          :key="card.attributes.type_id"
          :type_id="card.attributes.type_id"
          :name="card.name"
          :cost="card.attributes.cost"
          :cset="card.attributes.card_set"
          :edition_total="card.attributes.edition_total"
          :in_store="card.attributes.in_store"
          :level="card.attributes.card_level"
          :unlock_czxp="card.attributes.unlock_czxp"
          :buy_czxp="card.attributes.buy_czxp"
          :transfer_czxp="card.attributes.transfer_czxp"
          :sacrifice_czxp="card.attributes.sacrifice_czxp"
          :image="card.image"
          :card_class="card.attributes.rarity"
          :isOwned="card.isOwned"
        ></OwnedCardContent>
      </div>
    </div>
    <!--/main-->
  </div>
</template>

<script>
import axios from 'axios';

import OwnedCardContent from "@/components/OwnedCardContent.vue";
import UniverseBalances from "@/components/UniverseBalances.vue";
import OwnerBalances from "@/components/OwnerBalances.vue";

import { showErrorToast, showPendingToast, showSuccessToast } from "../util/showToast";

export default {
  name: "ShopContent",
  components: {
    OwnedCardContent,
    UniverseBalances,
    OwnerBalances,
  },
  computed: {
    web3() {
      return this.$store.state.web3;
    },
    wallet() {
      return parseFloat(web3.fromWei(this.$store.state.web3.balance), "ether");
    },
    balance() {
      return this.$store.state.web3.balance;
    },
    coinbase() {
      return this.$store.state.web3.coinbase;
    },
    totalCyptozTypes() {
      return this.$store.state.totalCryptozTypes;
    },
    currentEvent() {
      return this.$store.state.lastChainEvent;
    },
  },
  watch: {
    balance(newValue, oldValue) {
      //console.log(`Updating balance from ${oldValue} to ${newValue}`);

      // new wallet.. reset their boosters and czxp balance
      if (newValue >= 2000000000000000) {
        this.buyBoostBtnOn = 1;
      }
    },
    currentEvent(newValue, oldValue) {
      console.log("SHOP currentEvent:", newValue);
      if (newValue !== oldValue && typeof newValue !== "undefined") {
        if (this.pendingTransaction == newValue.blockHash) {
          this.showSpinner = 0;
          this.transactionStatus = "Confirmed! Balance updated";
        }
      }
    },
  },
  data() {
    return {
      pendingTransaction: 0,
      showSpinner: 0,
      transactionStatus: "Pending confirmation...",
      showUnlimited: 1,
      transaction_number: "",
      storeCards: [],
      buyBoostBtnOn: 0,
      confirmBoosterBuyBtnDisabled: 0,
      totalCreditsToBuy: 1,
      allCards: [], //We never mangle this
    };
  },
  async mounted() {
    console.log(
      "The shop is mounted, call for the cards, if we have a contract.."
    );
    if (typeof Cryptoz !== "undefined") {
      await this.getAllTypes();
    } else {
      console.log("Cryptoz contract not defined !!!!!!!!!!");
    }
  },
  methods: {
    buyBoosters: function() {
      console.log("Buy boosters called..");

      //Hide the modal
      this.$bvModal.hide("buy-boosters-modal");

      //Change buy button to pending.. or show some pending state
      this.showSpinner = 1;
      this.transactionStatus = "Pending confirmation...";

      //pass to metamask
      var self = this;

      try {
        window.Cryptoz.deployed()
          .then(function(instance) {
            var totalBoostersCost =
              2000000000000000 * parseInt(self.totalCreditsToBuy);
            return instance.buyBoosterCard(parseInt(self.totalCreditsToBuy), {
              from: self.coinbase,
              value: totalBoostersCost,
            });
          })
          .then(this.handleBuyBooster); //update boosters owned and total types
      } catch (error) {
        console.error("buyBoosters cancelled/failed:", error);
      }
    },
    handleBuyBooster: function(error, result) {
      console.log("Handling buy booster", error, result);
      if (error) {
        console.log("USER REJECTED!!");
        this.showSpinner = 0;
      }
      //change from pending to ready
      this.pendingTransaction = result.receipt.blockHash;
      this.transactionStatus = "Broadcast to chain...";
    },
    getAllTypes: async function() {

      try {
        //Lets get all the cards now
        console.log("Get all the cards...");
        showPendingToast(this, 'Loading Store Cards...', {
          autoHideDelay: 1000
        });
        var self = this;

        //reset the view
        this.storeCards = [];

        // Creates an array [0, 1, 2 ...totalCyptozTypes - 1]
        const totalCardTypes = parseInt(this.totalCyptozTypes);
        const indexes = [...Array(totalCardTypes)].map((_,i) => i)

        const results = await Promise.all(indexes.map(async id => {
          const cardData = await this.getCard(id + 1);
          if (!cardData) {
            return;
          }

          return this.addIsOwnedProp(cardData);
        }))

        const storeCards = results.filter(result => result !== undefined);

        this.allCards = [...storeCards];
        this.storeCards = [...storeCards];
        showSuccessToast(this, 'Finished Loading Shop.');
      } catch (err) {
        console.log("Error loading cards: ", err);
        showErrorToast(this, "Failed to load shop.");
      }
    },

    addIsOwnedProp: async function (card) {
      const instance = await window.Cryptoz.deployed();
      const isOwned = await instance.cardTypesOwned(this.coinbase, card.id);
      card.isOwned  = isOwned;

      return card;
    },
  
    getCard: async function(cardId) {
      const res = await axios.get(
        `https://cryptoz.cards/services/getCardData.php?card_id=${cardId}`
      );
      if (res.status !== 200) {
        console.log(
          "Looks like there was a problem from FETCH. Status Code: " +
            response.status
        );
        return;
      }

      let cardObj = {
        ...res.data,
      };

      cardObj.id = cardId;

      if (cardObj.attributes[3].value !== "Store") {
        return;
      }

      var newAttr = {};
      //format the attributes to match our JS objects
      cardObj.attributes.forEach(function(element) {
        newAttr[element.trait_type] = element.value;
      });

      cardObj.attributes = newAttr;

      switch (cardObj.attributes.rarity) {
        case "Common":
          cardObj.attributes.rarity = "card-bg card-bg-6";
          break;
        case "Uncommon":
          cardObj.attributes.rarity = "card-bg card-bg-5";
          break;
        case "Rare":
          cardObj.attributes.rarity = "card-bg card-bg-4";
          break;
        case "Epic":
          cardObj.attributes.rarity = "card-bg card-bg-3";
          break;
        case "Diamond":
          cardObj.attributes.rarity = "card-bg card-bg-2";
          break;
        case "Platinum":
          cardObj.attributes.rarity = "card-bg card-bg-1";
          break;
      }

      if (cardObj.attributes.edition_total === 0) {
        cardObj.attributes.edition_total = "Unlimited";
      }

      return cardObj;
    },
    sortByName: function(param) {
      this.storeCards.sort(dynamicSort(param));
    },
    sortByAttr: function(param) {
      this.storeCards.sort(sortAttributes(param));
    },
  },
};
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
