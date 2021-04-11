<template>
  <div>
    <b-modal
      id="buy-boosters-modal"
      title="Buy Booster Credits @ 0.002 BNB each"
    >
      <div class="booster-modal-content">
        <p class="booster-modal-title">
          Booster cards will never be sold in the shop
        </p>
        <p class="booster-modal-explain">
          Enter the number of booster credits you would like to purchase:
        </p>
        <input
          id="toWallet"
          class="form-control"
          type="text"
          value="1"
          required
          @input="totalCreditsToBuy = $event.target.value"
        />
      </div>

      <template #modal-footer>
        <div class="booster-modal-footer">
          <b-button class="mt-3" variant="danger" @click="buyBoosters">
            Buy Credits
          </b-button>
          <b-button
            class="mt-3"
            variant="secondary"
            @click="$bvModal.hide('buy-boosters-modal')"
          >
            Cancel
          </b-button>
        </div>
      </template>
    </b-modal>
    <div class="jumbotron">
      <UniverseBalances />
      <h1><b-icon-tag-fill /> Minting Shop</h1>
      <p>
        The Shop is a place to mint limited edition Cryptoz Cards NFT tokens.
        Some cards are free, some have a cost. You may also buy and
        <router-link to="/my-cryptoz-nfts"> open a booster card </router-link>,
        which will randomly mint an unlimited edition NFT token.
      </p>
      <p>
        To mint a FREE NFT Or buy a Limited edition NFT, you will need the
        required minimum balance of CZXP tokens displayed on the botton of the
        card to unlock the minting button. The newly minted NFT will appear in
        <router-link to="/my-cryptoz-nfts"> Your NFT Crypt </router-link> once
        the transaction is confirmed. CZXP is NOT burned when minting
      </p>

      <div v-if="isWalletConnected">
        <div class="row">
          <div class="col">
            <b-button
              v-b-tooltip.hover="'Earn +120 CZXP per credit'"
              v-b-modal.buy-boosters-modal
              class="btn btn-danger"
              :disabled="balance < 2000000000000000 || isBuyingBooster"
            >
              Buy <b-icon-lightning-fill /> Booster Credits @ 0.002 BNB
            </b-button>
          </div>
        </div>
        <OwnerBalances />
      </div>

      <div v-else>
        <h2 class="centered">
          <b-button
            v-if="!isWalletConnected"
            id="connect-button"
            v-b-toggle.nav-collapse
            variant="primary"
            @click="onConnect"
          >
            Connect
          </b-button>
          your wallet to mint NFTs.
        </h2>
      </div>

      <div v-if="isLoadingShopCards" class="loading">
        <b-spinner style="width: 3rem; height: 3rem" type="grow" />
      </div>
      <div v-else>
        <div class="row sort-wrapper">
          <div class="col text-left">
            <SortDropdown @sort-by-attr="sortByAttr" />
          </div>
        </div>
      </div>
      <br />
      <div id="cards-wrapper">
        <div
          v-for="(card, i) in displayCards"
          :key="card.type_id"
          class="card-wrapper"
        >
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
          />
          <div v-if="isWalletConnected" class="card-button-container">
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
                balance <= card.cost || czxpBalance < parseInt(card.unlock_czxp)
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
                  @click="buyCard(card)"
                >
                  <b-icon-lock-fill
                    v-if="
                      balance <= card.cost ||
                      czxpBalance < parseInt(card.unlock_czxp)
                    "
                  />
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
                  @click="getCardForFree(card.type_id)"
                >
                  <b-icon-lock-fill
                    v-if="czxpBalance < parseInt(card.unlock_czxp)"
                  />
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
import debounce from "lodash/debounce";
import { BRow, BCol, BButton, BSpinner } from "bootstrap-vue";

import OwnedCardContent from "@/components/OwnedCardContent.vue";
import UniverseBalances from "@/components/UniverseBalances.vue";
import OwnerBalances from "@/components/OwnerBalances.vue";
import SortDropdown from "@/components/SortDropdown.vue";
import dAppStates from "@/dAppStates";
import { showErrorToast } from "../util/showToast";
import { MessageBus } from "@/messageBus";

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
    this.observer = new IntersectionObserver(this.onElementObserved, {
      root: this.$el,
      threshold: 1.0,
    });
    this.loadMoreCards = debounce(
      () => {
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
      },
      500,
      { leading: true }
    );
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
    displayCards() {
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
      if (
        newVal === dAppStates.CONNECTED ||
        newVal === dAppStates.WALLET_CONNECTED
      ) {
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
    getCardForFree: async function (type_id) {
      this.showTransactionModal();
      this.$store.dispatch("setCardAsBought", {
        cardId: type_id,
        isSorted: this.isCardSorted,
      });

      const result = await this.CryptozInstance.methods
        .getFreeCard(type_id)
        .send({ from: this.coinbase }, (err, txHash) => {
          this.hideTransactionModal();
        })
        .catch((err) => {
          this.$store.dispatch("setCardAsNotBought", {
            cardId: type_id,
            isSorted: this.isCardSorted,
          });

          if (err.code !== 4001) {
            console.log(err);
            showErrorToast(this, "Failed to mint card");
          }
        });

      if (result) {
        this.$store.dispatch("setCurrentEdition", {
          cardId: type_id,
          isSorted: this.isCardSorted,
        });
      }
    },
    buyCard: async function (cardAttributes) {
      this.$store.dispatch("setCardAsBought", {
        cardId: cardAttributes.id,
        isSorted: this.isCardSorted,
      });

      this.showTransactionModal();

      const result = await this.CryptozInstance.methods
        .buyCard(cardAttributes.type_id)
        .send(
          {
            from: this.coinbase,
            value: cardAttributes.cost * 1000000000000000000,
          },
          (err, transactionHash) => {
            this.hideTransactionModal();
          }
        )
        .catch((err) => {
          this.$store.dispatch("setCardAsNotBought", {
            cardId: cardAttributes.id,
            isSorted: this.isCardSorted,
          });
          if (err.code !== 4001) {
            console.log(err);
            showErrorToast(this, "Failed to mint card");
          }
        });

      if (result) {
        this.$store.dispatch("setCurrentEdition", {
          cardId: cardAttributes.id,
          isSorted: this.isCardSorted,
        });
      }
    },
    buyBoosters: function () {
      this.$bvModal.hide("buy-boosters-modal");
      this.isBuyingBooster = true;

      this.showTransactionModal();

      var totalBoostersCost =
        2000000000000000 * parseInt(this.totalCreditsToBuy);
      this.CryptozInstance.methods
        .buyBoosterCard(parseInt(this.totalCreditsToBuy))
        .send(
          { from: this.coinbase, value: totalBoostersCost },
          (err, txHash) => {
            this.hideTransactionModal();
          }
        )
        .catch((err) => {
          if (err.code !== 4001) {
            showErrorToast(this, "Failed to mint card");
          }
        })
        .finally(() => {
          this.isBuyingBooster = false;
        });
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
      this.$store.dispatch("setIsTransactionPending", true);
    },
    hideTransactionModal() {
      this.$store.dispatch("setIsTransactionPending", false);
    },
    onConnect: function () {
      MessageBus.$emit("connect");
    },
    onElementObserved(entries) {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) {
          return;
        }

        this.observer.unobserve(target);

        const index = parseInt(target.getAttribute("data-index"));
        // if the 10th last card scrolls into view, load more
        if (index === this.displayCards.length - 10) {
          if (this.canLoadMore) {
            this.loadMoreCards();
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
  transition: opacity 0.1s;
}
.fade-enter,
.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
/* add a little arrow for users to be sure which they're purchasing */
#buy-get-button-wrapper::before,
#owned-button-wrapper::before {
  content: "";
  position: absolute;
  top: -10px;
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

.centered {
  display: flex;
  justify-content: center;
}

#connect-button {
  font-size: 20px;
  padding: 5px 10px;
  margin-right: 10px;
}

.booster-modal-footer {
  display: flex;
  align-items: flex-end;

  button {
    margin-left: 16px;
  }
}

.booster-modal-title {
  font-weight: bold;
  font-size: 1.5rem;
}

.booster-modal-explain {
  font-size: 1.2rem;
}

.booster-modal-content {
  padding: 36px 36px;
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

  .booster-modal-content {
    padding: 10px 10px;
  }
}
</style>
