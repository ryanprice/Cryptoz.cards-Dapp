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
          <b-button
            class="btn btn-danger"
            v-bind:disabled="balance < 2000000000000000"
            v-b-modal.buy-boosters-modal
            >Buy Booster Credits @ 0.002E</b-button
          >
          <transition name="fade">
            <span v-if="showSpinner==1">
              <img src="@/assets/spinner.gif" class="spinner" /> <strong>{{transactionStatus}}</strong>
            </span>
          </transition>
        </div>
      </div>

      <br />
      <OwnerBalances></OwnerBalances>
      <br />

      <div class="row">
          <div class="col text-left">
            <SortDropdown @sort-by-attr="sortByAttr"></SortDropdown>
          </div>
        </div>
      <br>
      <div class="row">
        <div v-for="card in storeCards" :key="card.type_id">
          <OwnedCardContent
            :type_id="card.type_id"
            :name="card.name"
            :cost="card.cost"
            :cset="card.card_set"
            :edition_total="card.edition_total"
            :in_store="card.in_store"
            :level="card.card_level"
            :unlock_czxp="card.unlock_czxp"
            :buy_czxp="card.buy_czxp"
            :transfer_czxp="card.transfer_czxp"
            :sacrifice_czxp="card.sacrifice_czxp"
            :image="card.image"
            :card_class="card.rarity"
          ></OwnedCardContent>
          <div id="buy-get-button-wrapper" :class="balance <= card.cost || czxpBalance < parseInt(card.unlock_czxp) ? 'disabled-btn' : ''">
            <div v-if="card.cost > 0" id="buyBtnwrapper" v-b-tooltip.hover="buyBtnTooltipText(card.cost, card.unlock_czxp)">
              <button id="buy-button" :disabled="balance <= card.cost || czxpBalance < parseInt(card.unlock_czxp)" class="btn btn-danger" v-on:click="buyCard(card)">
                Buy Card {{card.cost}}E <b-icon-lock-fill v-if="balance <= card.cost || czxpBalance < parseInt(card.unlock_czxp)"></b-icon-lock-fill>
              </button>
            </div>
            <div v-else id="getBtnwrapper" v-b-tooltip.hover="getBtnTooltipText(card.unlock_czxp)">
              <button id="get-button"  class="btn btn-danger" :disabled="czxpBalance < parseInt(card.unlock_czxp)" v-on:click="getCardForFree(card.type_id)">
                Get Card <b-icon-lock-fill v-if="czxpBalance < parseInt(card.unlock_czxp)"></b-icon-lock-fill>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--/main-->
  </div>
</template>

<script>
import axios from 'axios'
import OwnedCardContent from '@/components/OwnedCardContent.vue'
import UniverseBalances from '@/components/UniverseBalances.vue'
import OwnerBalances from '@/components/OwnerBalances.vue'
import SortDropdown from '@/components/SortDropdown.vue'
import {getEditionNumber, getRarity, dynamicSort} from '../helpers'
import { showErrorToast, showPendingToast, showSuccessToast } from "../util/showToast";

export default {
  name: "ShopContent",
  components: {
    OwnedCardContent,
    UniverseBalances,
    OwnerBalances,
    SortDropdown
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
    czxpBalance() {
      return this.$store.state.czxpBalance;
    },
    currentEvent() {
      return this.$store.state.lastChainEvent;
    },
  },
  watch: {
    currentEvent(newValue,oldValue) {
      if(newValue !== oldValue && typeof newValue !== "undefined"){
        if (this.pendingTransaction === newValue.blockHash) {
          this.showSpinner = 0;
          this.transactionStatus = 'Confirmed! balance updated';
        }
      }
    },
    totalCyptozTypes(newValue, oldValue) {
      if (newValue !== oldValue && newValue > 0) {
        this.getAllTypes();
      }
    }
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
      totalCreditsToBuy : 1,
      allCards : {}, //We never mangle this,
      buyBtnTooltipTextContent: 'Click to buy a copy of this card',
      buyBtnBlockedTooltipTextContent:'You do not have enough Ether or CZXP tokens to purchase this card',
      getBtnTooltipTextContent: 'Click to get a copy of this card at no cost',
      getBtnBlockedTooltipTextContent: 'You do not have enough CZXP tokens to unlock this button and claim this Free card'
    }
  },
  async mounted() {
    console.log(
      "The shop is mounted, call for the cards, if we have a contract.."
    );
    if (typeof Cryptoz !== "undefined" && this.coinbase) {
      await this.getAllTypes();
    } else {
      console.log("Cryptoz contract not defined !!!!!!!!!!");
    }
  },
  methods : {
    buyCard : function(cardAttributes){
      console.log("Buying card:" + cardAttributes.type_id);
      
      window.Cryptoz.deployed().then((instance) => {
        return instance.buyCard(cardAttributes.type_id, {from: this.coinbase, value:(cardAttributes.cost*1000000000000000000)});
      }).then((res) => {
        this.showTransaction =1
        this.$store.dispatch('updateOwnerBalances')
      })
    },
    getCardForFree : function(type_id){
      console.log("Claiming card:" + type_id);
      
      showPendingToast(this);
      window.Cryptoz.deployed().then((instance) => {
        return instance.getFreeCard(type_id, {from: this.coinbase});
      }).then((res) => {
        this.showTransaction =1
        this.$store.dispatch('updateOwnerBalances')
      })
    },
    buyBoosters : function() {
      //Hide the modal
      this.$bvModal.hide("buy-boosters-modal");

      //Change buy button to pending.. or show some pending state
      this.showSpinner = 1;
      this.transactionStatus = 'Pending confirmation...';
      
      Cryptoz.deployed()
      .then((instance) => {
        var totalBoostersCost = 2000000000000000 * parseInt(this.totalCreditsToBuy);
        return instance.buyBoosterCard(parseInt(this.totalCreditsToBuy), {from: this.coinbase, value:totalBoostersCost});
      })
      .then(this.handleBuyBooster) //update boosters owned and total types
      .catch(err => {
        console.err('USER REJECTED!!', err);
        this.showSpinner = 0;
      })
      
    },
    handleBuyBooster : function(result) {
        console.log('Handling buy booster', result);
        //change from pending to ready
        this.pendingTransaction = result.receipt.blockHash;
        this.transactionStatus = 'Broadcast to chain...';
    },
    getAllTypes: async function(){
      try {
        //Lets get all the cards now
        console.log("Get all the cards...");
        showPendingToast(this, 'Loading Store Cards...', {
          autoHideDelay: 1000
        });
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
        this.storeCards = results.filter(result => result !== undefined);
        if (this.storeCards.length > 0) {
          showSuccessToast(this, 'Finished Loading Shop.');
        }
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

      let cardObj = {...res.data};

      cardObj.id = cardId;

      if (res.data.attributes[3].value !== "Store") {
        return;
      }
      
      //format the attributes to match our JS objects
      res.data.attributes.forEach(function(element) {
        cardObj[element.trait_type] = element.value;
      });

      switch (cardObj.rarity) {
        case "Common":
          cardObj.rarity = "card-bg card-bg-6";
          break;
        case "Uncommon":
          cardObj.rarity = "card-bg card-bg-5";
          break;
        case "Rare":
          cardObj.rarity = "card-bg card-bg-4";
          break;
        case "Epic":
          cardObj.rarity = "card-bg card-bg-3";
          break;
        case "Diamond":
          cardObj.rarity = "card-bg card-bg-2";
          break;
        case "Platinum":
          cardObj.rarity = "card-bg card-bg-1";
          break;
      }

      if (cardObj.edition_total === 0) {
        cardObj.edition_total = "Unlimited";
      }

      this.allCards[cardObj.type_id] = cardObj;
      return cardObj;
    },
    buyBtnTooltipText(cost, unlock_czxp) {
      if (this.balance <= cost || this.czxpBalance < parseInt(unlock_czxp)) {
        return this.buyBtnBlockedTooltipTextContent
      } else {
        return this.buyBtnTooltipTextContent
      }
    },
    getBtnTooltipText(unlock_czxp) {
      if (this.czxpBalance < parseInt(unlock_czxp)) {
        return this.getBtnBlockedTooltipTextContent
      } else {
        return this.getBtnTooltipTextContent
      }
    },
    sortByAttr: function(param, isDescending) {
      switch(param) {
        case "edition_number":
          this.storeCards.sort(dynamicSort(param, isDescending, false, getEditionNumber));
          break
        case "rarity":
          this.storeCards.sort(dynamicSort(param, isDescending, true, getRarity))
          break
        default:
          this.storeCards.sort(dynamicSort(param, isDescending))
          break
      }
    }
  }
}
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
    transition: opacity .10s;
  }
  .fade-enter,
  .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  #buy-get-button-wrapper{
    position: relative;
    text-align: center;
    height: 45px;
  }
  /* add a little arrow for users to be sure which they're purchasing */
  #buy-get-button-wrapper::before {
    content: '';
    position: absolute;
    top:-10px;
    transform: translateX(-50%);
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #dc3545;
  }

  .disabled-btn::before {
    opacity: .65;
  }
</style>
