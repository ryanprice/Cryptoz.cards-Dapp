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
    <div class="jumbotron">
      <UniverseBalances />
      <h1><b-icon-tag-fill /> Minting Shop</h1>
      <p>
        The Shop is a place to mint limited edition Cryptoz Cards NFT tokens.
        Some cards are free, some have a cost. You may also buy and
        <router-link to="/my-cryptoz-nfts">open a booster card</router-link>,
        which will randomly mint an unlimited edition NFT token.
      </p>
      <p>
        To mint a FREE NFT Or buy a Limited edition NFT, you will need the
        required minimum balance of CZXP tokens displayed on the botton of the
        card to unlock the minting button. The newly minted NFT will appear in
        <router-link to="/my-cryptoz-nfts"> Your NFT Crypt</router-link> once
        the transaction is confirmed. CZXP is NOT burned when minting
      </p>

      <div v-if="isWalletConnected">
        <div class="row">
          <div class="col">
            <b-button
              v-b-tooltip.hover="'Earn +120 CZXP per credit'"
              class="btn btn-danger"
              v-bind:disabled="balance < 2000000000000000 || isBuyingBooster"
              v-b-modal.buy-boosters-modal
              >Buy <b-icon-lightning-fill />  Booster Credits @ 0.002 BNB</b-button>
          </div>
        </div>
        <OwnerBalances />
      </div>

      <div v-else>
        <h2 class="centered">
          <b-button
            id="connect-button"
            v-if="!isWalletConnected"
            variant="primary"
            v-on:click="onConnect"
            v-b-toggle.nav-collapse
          >
            Connect
          </b-button>
          your wallet to mint NFTs.
        </h2>
      </div>

      <div class="loading" v-if="isLoadingShopCards">
        <b-spinner style="width: 3rem; height: 3rem" type="grow"></b-spinner>
      </div>
      <div v-else>
        <div class="row sort-wrapper">
          <div class="col text-left">
            <SortDropdown @sort-by-attr="sortByAttr"></SortDropdown>
          </div>
        </div>
      </div>
      <br>
      <div id="cards-wrapper">
        <div v-for="(card, i) in displayCards" :key="card.type_id" class="card-wrapper">
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
            :index="i"
            :observer="observer"
          ></OwnedCardContent>
          <div class="card-button-container" v-if="isWalletConnected">
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
              :class="
                balance <= card.cost ||
                czxpBalance < parseInt(card.unlock_czxp)
                  ? 'disabled-btn'
                  : ''
              "
            >
              <div
                v-if="card.cost > 0"
                id="buyBtnwrapper"
                v-b-tooltip.hover="
                  buyBtnTooltipText(card.cost, card.unlock_czxp)
                "
              >
                <b-button
                  id="buy-button"
                  :disabled="
                    balance <= card.cost ||
                    czxpBalance < parseInt(card.unlock_czxp)
                  "
                  variant="primary"
                  v-on:click="buyCard(card)"
                >
                  <b-icon-lock-fill
                    v-if="
                      balance <= card.cost ||
                      czxpBalance < parseInt(card.unlock_czxp)
                    "
                  ></b-icon-lock-fill>
                  Mint NFT for {{ card.cost }} BNB
                </b-button>
              </div>
              <div
                v-else
                id="getBtnwrapper"
                v-b-tooltip.hover="getBtnTooltipText(card.unlock_czxp)"
              >
                <button
                  id="get-button"
                  class="btn btn-primary"
                  :disabled="czxpBalance < parseInt(card.unlock_czxp)"
                  v-on:click="getCardForFree(card.type_id)"
                >
                  <b-icon-lock-fill
                    v-if="czxpBalance < parseInt(card.unlock_czxp)"
                  ></b-icon-lock-fill>
                  Mint for FREE
                </button>
              </div>
            </div>
            <div
              v-else
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from 'axios'
import { BRow, BCol, BButton, BSpinner } from "bootstrap-vue";

import OwnedCardContent from '@/components/OwnedCardContent.vue'
import UniverseBalances from '@/components/UniverseBalances.vue'
import OwnerBalances from '@/components/OwnerBalances.vue'
import SortDropdown from '@/components/SortDropdown.vue'
import dAppStates from '@/dAppStates'
import { getRarity, dynamicSort} from '../helpers'
import { showRejectedToast, showSuccessToast, showPendingToast } from "../util/showToast";
import getCardType from '../util/getCardType'
import { MessageBus } from '@/messageBus';

export default {
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
  data() {
    return {
      buyBtnTooltipTextContent: "Click to buy a copy of this card",
      buyBtnBlockedTooltipTextContent:
        "You do not have enough BNB or CZXP tokens to purchase this card",
      getBtnTooltipTextContent: "Click to mint a copy of this card at no cost",
      getBtnBlockedTooltipTextContent:
        "You do not have enough CZXP tokens to unlock minting an NFT of this type",
      getOwnedCardToolTipText: "You can only mint 1 card of each type",
      getSoldCardToolTipText:
        "All NFTs of this type have been minted, check markets",
      totalCreditsToBuy: 1,
      isBuyingBooster: false,
      isCardSorted: false,
      pageSize: 15,
      paginatedCards: [],
      sortedPaginatedCards: [],
      pageNext: 0,
      sortedPageNext: 0,
      observer: null,
    };
  },
  beforeDestroy() {
    this.observer.disconnect();
  },
  created() {
    this.observer = new IntersectionObserver(
      this.onElementObserved, 
      {
        root: this.$el,
        threshold: 1.0,
      }
    );
    this.loadMoreCards = _.debounce(() => {
      if (this.isCardSorted) {
        const newCards = this.$store.getters.getPaginatedShopCards(
          this.pageSize,
          this.sortedPageNext,
          this.isCardSorted
        );
        this.sortedPaginatedCards = [
          ...this.sortedPaginatedCards,
          ...newCards.cards,
        ];
        this.sortedPageNext = newCards.next;
      } else {
        const newCards = this.$store.getters.getPaginatedShopCards(
          this.pageSize,
          this.pageNext,
          this.isCardSorted
        );
        this.paginatedCards = [...this.paginatedCards, ...newCards.cards];
        this.pageNext = newCards.next;
      }
    }, 500, {leading: true})
  },
  mounted() {
    if (this.CryptozInstance) {
      this.fetchStoreCards();
    }
  },
  computed: {
    dAppState() {
      return this.$store.state.dAppState;
    },
    isWalletConnected() {
      return this.$store.state.dAppState === dAppStates.WALLET_CONNECTED;
    },
    CryptozInstance() {
      return this.$store.state.contractInstance.cryptoz;
    },
    czxpBalance() {
      return this.$store.state.czxpBalance;
    },
    balance() {
      return this.$store.state.web3.balance;
    },
    coinbase() {
      return this.$store.state.web3.coinbase;
    },
    currentEvent() {
      return this.$store.state.lastChainEvent;
    },
    displayCards() {
      // if (this.isLoadingShopCards || !this.isShopLoadingFinished) {
      //   return [];
      // }
      // const pageStart = this.isCardSorted ? this.sortedPageNext : this.pageNext;
      // const newCards = this.$store.getters.getPaginatedShopCards(
      //   this.pageSize,
      //   pageStart,
      //   this.isCardSorted
      // );

      // if (this.isCardSorted) {
      //   this.sortedPaginatedCards = [
      //     ...this.sortedPaginatedCards,
      //     ...newCards.cards,
      //   ];
      //   this.sortedPageNext = newCards.next;
      //   return this.sortedPaginatedCards;
      // } else {
      //   this.paginatedCards = [...this.paginatedCards, ...newCards.cards];
      //   this.pageNext = newCards.next;
      //   return this.paginatedCards;
      // }
      return this.isCardSorted
        ? this.sortedPaginatedCards
        : this.paginatedCards;
    },
    canLoadMore() {
      if (this.isCardSorted) {
        return this.sortedPageNext !== null;
      } else {
        return this.pageNext !== null;
      }
    },
    ...mapGetters(["isLoadingShopCards", "isShopLoadingFinished"]),
  },
  watch: {
    dAppState(newVal) {
      if (newVal === dAppStates.CONNECTED || newVal === dAppStates.WALLET_CONNECTED) {
        this.fetchStoreCards();
      }
    },
  },
  methods: {
    fetchStoreCards: async function () {
      await this.$store.dispatch("fetchStoreCards");

      const pageStart = this.isCardSorted ? this.sortedPageNext : this.pageNext;
      const newCards = this.$store.getters.getPaginatedShopCards(
        this.pageSize,
        pageStart,
        this.isCardSorted
      );

      if (this.isCardSorted) {
        this.sortedPaginatedCards = [
          ...this.sortedPaginatedCards,
          ...newCards.cards,
        ];
        this.sortedPageNext = newCards.next;
      } else {
        this.paginatedCards = [...this.paginatedCards, ...newCards.cards];
        this.pageNext = newCards.next;
      }
    },
    getBtnTooltipText(unlock_czxp) {
      if (this.czxpBalance < parseInt(unlock_czxp)) {
        return this.getBtnBlockedTooltipTextContent;
      } else {
        return this.getBtnTooltipTextContent;
      }
    },
    getCardForFree: async function(type_id){
      this.showTransactionModal()
      this.$store.dispatch("setCardAsBought", {
        cardId: type_id,
        isSorted: this.isCardSorted,
      });

      const result = await this.CryptozInstance.methods
        .getFreeCard(type_id)
        .send({from: this.coinbase}, (err, txHash) => {
          this.hideTransactionModal();
        })
        .catch(err => {
          this.$store.dispatch("setCardAsNotBought", {
            cardId: type_id,
            isSorted: this.isCardSorted,
          });

          if (err.code !== 4001) {
            console.log(err)
            showErrorToast(this, 'Failed to mint card')
          }
        })

      if (result) {
        this.$store.dispatch("setCurrentEdition", {
          cardId: type_id,
          isSorted: this.isCardSorted,
        });
      }
    },
    buyCard: async function(cardAttributes){
      this.$store.dispatch("setCardAsBought", {
        cardId: cardAttributes.id,
        isSorted: this.isCardSorted,
      });

      this.showTransactionModal()

      const result = await this.CryptozInstance.methods
        .buyCard(cardAttributes.type_id)
        .send({from: this.coinbase, value:(cardAttributes.cost*1000000000000000000)}, (err, transactionHash) => {
          this.hideTransactionModal();
        })
        .catch(err => {
          this.$store.dispatch("setCardAsNotBought", {
            cardId: cardAttributes.id,
            isSorted: this.isCardSorted,
          });
          if (err.code !== 4001) {
            console.log(err)
            showErrorToast(this, 'Failed to mint card')
          }
        })

      if (result) {
        this.$store.dispatch("setCurrentEdition", {
          cardId: cardAttributes.id,
          isSorted: this.isCardSorted,
        });
      }
    },
    buyBoosters : function() {
      this.$bvModal.hide("buy-boosters-modal");
      this.isBuyingBooster = true;

      this.showTransactionModal()

      var totalBoostersCost = 2000000000000000 * parseInt(this.totalCreditsToBuy);
      this.CryptozInstance.methods
        .buyBoosterCard(parseInt(this.totalCreditsToBuy))
        .send({from: this.coinbase, value:totalBoostersCost}, (err, txHash) => {
          this.hideTransactionModal();
        })
        .catch(err => {
          if (err.code !== 4001) {
            showErrorToast(this, 'Failed to mint card')
          }
        })
        .finally(() => {
          this.isBuyingBooster = false;
        })
    },
    buyBtnTooltipText(cost, unlock_czxp) {
      if (this.balance <= cost || this.czxpBalance < parseInt(unlock_czxp)) {
        return this.buyBtnBlockedTooltipTextContent;
      } else {
        return this.buyBtnTooltipTextContent;
      }
    },
    sortByAttr: async function (param, isDescending) {
      if (!param) {
        // We cleared sort.
        // Clear all data so we start with a new page of sort
        this.isCardSorted = false;
        this.sortedPaginatedCards = [];
        this.sortedPageNext = 0;
        return;
      }

      this.sortedPaginatedCards = [];
      this.sortedPageNext = 0;
      this.isCardSorted = true;
      await this.$store.dispatch("sortCards", {
        param,
        isDescending,
      });

      const newCards = this.$store.getters.getPaginatedShopCards(
        this.pageSize,
        this.sortedPageNext,
        this.isCardSorted
      );

      this.sortedPaginatedCards = [...newCards.cards];
      this.sortedPageNext = newCards.next;
    },
    showTransactionModal() {
      this.$store.dispatch('setIsTransactionPending', true)
    },
    hideTransactionModal() {
      this.$store.dispatch('setIsTransactionPending', false)
    },
    onConnect: function() {
      MessageBus.$emit('connect')
    },
    onElementObserved(entries) {
      entries.forEach(({ target, isIntersecting}) => {
          if (!isIntersecting) {
            return;
          }
          
          this.observer.unobserve(target);
        
          const index = parseInt(target.getAttribute("data-index"));
          // if the 10th last card scrolls into view, load more
          if (index === this.displayCards.length - 10) {
            if (this.canLoadMore) {
              this.loadMoreCards()
            }
          }
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#buy-get-button-wrapper,
#owned-button-wrapper,
#sold-button-wrapper {
  position: relative;
  text-align: center;
}

#sold-button-wrapper::before {
  content: "";
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #dc3545;
}

.disabled-btn::before {
  opacity: 0.65;
}

.loading {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 36px;
}

.sort-wrapper {
  margin-bottom: 36px;
}

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

.shop-card-item {
  display: flex;
  flex-direction: column;
  width: 260px;
}

.flex-row {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
}

.card-button-container {
  display: flex;
  justify-content: center;
}

.card-button-container button {
  font-size: 16px;
}

#cards-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  place-items: center;
}

.card-wrapper {
  display: flex;
  min-width: 0;
  flex-direction: column;
  width: 260px;
}

.load-more {
  width: 100%;
  margin-top: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media screen and (max-width: 1000px) {
  #cards-wrapper {
    grid-template-columns: repeat(auto-fit, minmax(calc(0.55 * 260px), 1fr));

    .card-wrapper {
      width: calc(0.55 * 260px);

      .card-button-container {
        margin-top: 5px;

        button {
          padding: 3%;
          font-size: 12px;
          width: 80%;
        }
      }
    }
  }
}

.centered {
  display: flex;
  justify-content: center;
}

#connect-button {
  font-size: 20px;
  padding: 5px 10px;
  margin-right: 10px;
}
</style>
