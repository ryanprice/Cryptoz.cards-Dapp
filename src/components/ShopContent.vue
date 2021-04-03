<template>
  <div>
    <b-modal
      id="buy-boosters-modal"
      title="Buy Booster Credits @ 0.002 BNB each"
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
      <h1><b-icon-tag-fill /> Minting Shop</h1>
      <p>
        The Shop is a place to mint limited edition Cryptoz Cards NFT tokens. Some cards
        are free, some have a cost. You may also buy and <router-link to="/my-cryptoz-nfts">open a booster card</router-link>,
        which will randomly mint an unlimited edition NFT token.
      </p>
      <p>
        To mint a FREE NFT Or buy a Limited edition NFT, you will need the
        required minimum balance of CZXP tokens displayed on the botton of the card to unlock the minting button. The newly minted NFT will appear in <router-link to="/my-cryptoz-nfts"> Your NFT Crypt</router-link> once the transaction is confirmed. CZXP is NOT burned when minting
      </p>
      <div class="row">
        <div class="col">
          <b-button
            v-b-tooltip.hover="'Earn +120 CZXP per credit'"
            class="btn btn-danger"
            v-bind:disabled="balance < 2000000000000000"
            v-b-modal.buy-boosters-modal
            >Buy <b-icon-lightning-fill />  Booster Credits @ 0.002 BNB</b-button>
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
      <div class="flex-row">
        <div v-for="card in sortedCards" :key="card.type_id" class="shop-card-item">
          <OwnedCardContent
            :type_id="card.type_id"
            :name="card.name"
            :cost="card.cost"
            :cset="card.card_set"
            :edition_current="card.edition_current"
            :edition_total="card.edition_total"
            :in_store="card.in_store"
            :level="card.card_level"
            :unlock_czxp="card.unlock_czxp"
            :buy_czxp="card.buy_czxp"
            :transfer_czxp="card.transfer_czxp"
            :sacrifice_czxp="card.sacrifice_czxp"
            :image="card.image"
            :card_class="card.rarity"
            :card_owned="false"
          ></OwnedCardContent>
          <div class="card-button-container">
            <div
              v-if="card.soldOut == 1"
              id="sold-button-wrapper"
              v-b-tooltip.hover="getSoldCardToolTipText"
              class="disabled-btn"
            >
              <button id="owned-button" disabled class="btn btn-danger">
              SOLD OUT!
              </button>
            </div>
            <div
              v-else-if="!card.isOwned"
              id="buy-get-button-wrapper"
              :class="balance <= card.cost || czxpBalance < parseInt(card.unlock_czxp) ? 'disabled-btn' : ''"
            >
              <div v-if="card.cost > 0" id="buyBtnwrapper" v-b-tooltip.hover="buyBtnTooltipText(card.cost, card.unlock_czxp)">
                <b-button id="buy-button" :disabled="balance <= card.cost || czxpBalance < parseInt(card.unlock_czxp)" variant="primary" v-on:click="buyCard(card)">
                  <b-icon-lock-fill v-if="balance <= card.cost || czxpBalance < parseInt(card.unlock_czxp)"></b-icon-lock-fill> Mint NFT for {{card.cost}} BNB
                </b-button>
              </div>
              <div v-else id="getBtnwrapper" v-b-tooltip.hover="getBtnTooltipText(card.unlock_czxp)">
                <button id="get-button"  class="btn btn-primary" :disabled="czxpBalance < parseInt(card.unlock_czxp)" v-on:click="getCardForFree(card.type_id)">
                  <b-icon-lock-fill v-if="czxpBalance < parseInt(card.unlock_czxp)"></b-icon-lock-fill> Mint for FREE
                </button>
              </div>
            </div>
            <div
              v-else-if="card.isOwned"
              id="owned-button-wrapper"
              v-b-tooltip.hover="getOwnedCardToolTipText"
              class="disabled-btn"
            >
              <button id="owned-button" disabled class="btn btn-info">
                You already minted one
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
import { getRarity, dynamicSort} from '../helpers'
import { showErrorToast, showPendingToast, showRejectedToast, showSuccessToast } from "../util/showToast";
import getCardType from '../util/getCardType'
import {
  BRow,
  BCol,
  BButton,
  BSpinner,
} from 'bootstrap-vue'

export default {
  name: "ShopContent",
  components: {
    OwnedCardContent,
    UniverseBalances,
    OwnerBalances,
    SortDropdown,
    BRow,
    BCol,
    BButton,
    BSpinner,
  },
  computed: {
    web3() {
      return this.$store.state.web3;
    },
    CryptozInstance() {
      return this.$store.state.contractInstance.cryptoz;
    },
    wallet() {
      return parseFloat(web3.utils.fromWei(this.$store.state.web3.balance.toString()), "ether");
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
    storeCards() {
      return this.$store.state.shop.cards;
    },
  },
  watch: {
    currentEvent(newValue,oldValue) {
      // we only update events in the store when it concerns our wallet
      if (newValue !== oldValue && typeof newValue !== "undefined") {
        this.getAllTypes();
      }
    },
    CryptozInstance(newVal) {
      if (newVal) {
        this.getAllTypes();
      }
    },
    totalCyptozTypes(newValue, oldValue) {
      if (newValue !== oldValue && newValue > 0) {
        this.getAllTypes();
      }
    },
    storeCards(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.sortedCards = [...newVal]
      }
    }
  },
  data() {
    return {
      sortedCards: [],
      pendingTransaction: 0,
      transactionStatus: "Pending confirmation...",
      showUnlimited: 1,
      transaction_number: "",
      typesOnChain: [],
      buyBoostBtnOn: 0,
      confirmBoosterBuyBtnDisabled: 0,
      totalCreditsToBuy : 1,
      allCards : {}, //We never mangle this,
      buyBtnTooltipTextContent: 'Click to buy a copy of this card',
      buyBtnBlockedTooltipTextContent:'You do not have enough BNB or CZXP tokens to purchase this card',
      getBtnTooltipTextContent: 'Click to mint a copy of this card at no cost',
      getBtnBlockedTooltipTextContent: 'You do not have enough CZXP tokens to unlock minting an NFT of this type',
      getOwnedCardToolTipText: 'You can only mint 1 card of each type',
      getSoldCardToolTipText: 'All NFTs of this type have been minted, check markets'
    }
  },
  async created() {
    this.getAllTypes = _.debounce(async function() {
      try {
        let showNotification = false
        if (this.storeCards.length === 0) {
          showPendingToast(this, 'Loading Store Cards...', {
            autoHideDelay: 1000
          });
          showNotification = true
        }

        const typeIdsOnChain = []

        //push Apr 1,2021
        typeIdsOnChain.push(135,136,137);
        //push March 31,2021
        typeIdsOnChain.push(131,132,133,134);
        //push March 27,2021
        typeIdsOnChain.push(64,71,74,79,84,87,91,93,95,96,104);
        //push March 20,2021
        typeIdsOnChain.push(47,51,58,60,61,63);
        //push March 20,2021
        typeIdsOnChain.push(34,38,41,43);
        //push March 19,2021
        typeIdsOnChain.push(13,18,19,26);
        //Dirty hack until we figure this event log shite out
        typeIdsOnChain.push(4,5,8,22,29,31,45,56,81,101,102,103);

        const results = await Promise.all(
          typeIdsOnChain.map(async id => {
            const cardData = await this.getCard(id);

            if (!cardData) {
              return;
            }

            return this.coinbase ? this.addIsOwnedProp(cardData) : cardData;
          })
        )
        const storeCards = results.filter(result => result !== undefined);
        this.$store.dispatch('setStoreCards', storeCards)

        if (storeCards.length > 0 && showNotification) {
          showSuccessToast(this, 'Finished Loading Shop.');
        }

      } catch (err) {
        console.log("Error loading cards: ", err);
        showErrorToast(this, "Failed to load shop.");
      }
    }, 500)
  },
  async mounted() {
    if (this.web3.isConnected && this.CryptozInstance) {
      await this.getAllTypes();
    }
  },
  methods : {
    buyCard : function(cardAttributes){
      const cardToBuyIndex = this.sortedCards.findIndex(card => card.id === cardAttributes.id)
      this.sortedCards[cardToBuyIndex].isOwned = true;
      console.log("Buying card:", cardAttributes.id);

      showPendingToast(this)

      this.CryptozInstance.buyCard(cardAttributes.type_id, {from: this.coinbase, value:(cardAttributes.cost*1000000000000000000)})
        .catch(err => {
          showRejectedToast(this)
          this.sortedCards[cardToBuyIndex].isOwned = false;
        })
    },
    getCardForFree : function(type_id){
      showPendingToast(this)
      const cardToGet = this.sortedCards.findIndex(card => card.id === parseInt(type_id, 10))
      this.sortedCards[cardToGet].isOwned = true;

      this.CryptozInstance.getFreeCard(type_id, {from: this.coinbase})
        .catch(err => {
          showRejectedToast(this)
          this.sortedCards[cardToGet].isOwned = false;
        })
    },
    buyBoosters : function() {
      this.$bvModal.hide("buy-boosters-modal");

      showPendingToast(this)

      var totalBoostersCost = 2000000000000000 * parseInt(this.totalCreditsToBuy);
      this.CryptozInstance.buyBoosterCard(parseInt(this.totalCreditsToBuy), {from: this.coinbase, value:totalBoostersCost})
        .catch(err => {
          showRejectedToast(this)
        })
    },
    addIsOwnedProp: async function (card) {
      const isOwned = await this.CryptozInstance.cardTypesOwned(this.coinbase, card.id);
      card.isOwned  = isOwned;

      return card;
    },
    getCard: async function(cardId) {
      const res = await getCardType(cardId)
      if (!res) {
        console.log(`Failed to fetch card ${cardId}.json`);
        return;
      }

      let cardObj = {...res};

      cardObj.id = cardId;

      if (res.attributes[3].value !== "Store") {
        return;
      }

      //format the attributes to match our JS objects
      res.attributes.forEach(function(element) {
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

      //Get NFTs minted already to inject in our edition totals
      this.CryptozInstance.cardTypeToEdition(cardObj.id)
        .then((result) => {
          cardObj.edition_current = parseInt(result)

          //Edition bug hack
          if(cardObj.id == 102){ //dragon edition limit bug ?
            cardObj.edition_total = 5;
          }
          if(cardObj.id == 103){ //bleeding fury edition limit bug ?
            cardObj.edition_total = 1;
          }
          if(cardObj.id == 5){ //stu bug ?
            cardObj.edition_total = 110;
          }
          if(cardObj.id == 22){ //thrny bug ?
            cardObj.edition_total = 179;
          }
          if(cardObj.id == 56){ //shroom ?
            cardObj.edition_total = 112;
          }
          if(cardObj.id == 19){ //guts r us
            cardObj.edition_total = 80;
          }
          if(cardObj.id == 43){ //medula
            cardObj.edition_total = 215;
          }
          if(cardObj.id == 26){ //zombie egg
            cardObj.edition_total = 288;
          }
          if(cardObj.id == 104){ //grumps
            cardObj.edition_total = 7;
          }
          if(cardObj.id == 60){ //wraith
            cardObj.edition_total = 384;
          }
          if(cardObj.id == 93){ //elephant
            cardObj.edition_total = 49;
          }
          if(cardObj.id == 74){ //dust bunny
            cardObj.edition_total = 189;
          }
          if(cardObj.id == 96){ //lemur
            cardObj.edition_total = 109;
          }
          // Set soldOut flag first
          if(cardObj.edition_current == cardObj.edition_total) {
            cardObj.soldOut = 1;
          }
        })
        .catch(err => {
          console.error('Error getting NFTs minted:', err);
        })

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
          this.sortedCards.sort(dynamicSort('edition_current', isDescending, false));
          break
        case "rarity":
          this.sortedCards.sort(dynamicSort(param, isDescending, true, getRarity))
          break
        default:
          this.sortedCards.sort(dynamicSort(param, isDescending))
          break
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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
  #buy-get-button-wrapper,
  #owned-button-wrapper,
  #sold-button-wrapper {
    position: relative;
    text-align: center;
  }
  /* add a little arrow for users to be sure which they're purchasing */
  #buy-get-button-wrapper::before,
  #owned-button-wrapper::before {
    content: '';
    position: absolute;
    top:-10px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #007bff;
  }

  #owned-button-wrapper::before {
    border-bottom: 10px solid #17a2b8;
  }

  #sold-button-wrapper::before {
    content: '';
    position: absolute;
    top:-10px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #dc3545;
  }

  .disabled-btn::before {
    opacity: .65;
  }

  .flex-row {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
  }

  .shop-card-item {
    display: flex;
    flex-direction: column;
    width: 260px;
  }

  .card-button-container {
    display: flex;
    justify-content: center;
  }

  .card-button-container button {
    font-size: 16px;
  }

  @media screen and (max-width: 800px) {
    .shop-card-item {
      width: calc(0.55 * 260px);
    }

    .card-button-container {
      margin-top: 5px;
    }

    .card-button-container button {
      padding: 3%;
      font-size: 12px;
      width: 80%;
    }
  }
</style>
