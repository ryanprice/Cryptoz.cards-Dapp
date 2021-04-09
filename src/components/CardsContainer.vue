<template>
  <div>
    <div class="wrapper">
      <div id="button-container">
        <div class="primary-actions">
          <SortDropdown :disabled="!ownsCards" @sort-by-attr="sortByAttr" />
          <b-button
            id="view-change-button"
            variant="info"
            :disabled="!ownsCards"
            @click="() => toggleTableView()"
          >
            {{ "View " + (isTableView ? "Gallery" : "Table") }}
          </b-button>
        </div>
        <div class="crypt-actions">
          <input
            id="my-crypt-link"
            ref="myCrypt"
            hidden
            :value="getMyCryptLink"
          />
          <b-button
            v-if="isOthersCrypt"
            class="my-crypt-button"
            variant="warning"
            @click="() => goBackToMyCrypt()"
          >
            Go To My Crypt
          </b-button>
          <b-button
            v-else
            class="my-crypt-button"
            variant="warning"
            @click="() => copyMyCryptLink()"
          >
            Copy My Crypt Link
          </b-button>
          <b-input-group class="crypt-search-input-group">
            <b-form-input
              v-model="addressToSearch"
              trim
              type="text"
              placeholder="Wallet Address"
              :state="addressToSearchState"
            />
            <b-input-group-append>
              <b-button
                :disabled="disableSearch"
                variant="success"
                @click="() => searchNewCrypt()"
              >
                Go
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </div>
      </div>
      <div v-if="isLoading" class="loading">
        <b-spinner style="width: 3rem; height: 3rem" type="grow" />
      </div>
      <div v-else>
        <div v-if="isOthersCrypt || isWalletConnected">
          <div v-if="!isTableView" class="cards-wrapper">
            <div
              v-for="(card, i) in orderedCards"
              :key="card.id"
              class="card-wrapper"
            >
              <OwnedCardContent
                :id="card.id"
                :type_id="card.type_id"
                :name="card.name"
                :cost="card.cost"
                :cset="card.card_set"
                :edition_current="card.edition_current"
                :edition_total="card.edition_total"
                :level="card.card_level"
                :unlock_czxp="card.unlock_czxp"
                :buy_czxp="card.buy_czxp"
                :transfer_czxp="card.transfer_czxp"
                :sacrifice_czxp="card.sacrifice_czxp"
                :image="card.image"
                :card_class="card.rarity"
                :in_store="card.in_store"
                :card_owned="true"
                :index="i"
              />
              <div v-if="!isOthersCrypt" class="sacrifice-wrapper">
                <div>
                  <button
                    v-b-tooltip.hover="'Sacrifice'"
                    :disabled="
                      cardsBeingGifted[card.id] || cardsBeingSacrificed[card.id]
                    "
                    class="btn btn-danger"
                    @click="sacrificeCard(card.id)"
                  >
                    <span class="emoji">☠️</span>
                  </button>
                </div>
                <b-spinner
                  v-if="
                    cardsBeingGifted[card.id] || cardsBeingSacrificed[card.id]
                  "
                  label="Spinning"
                />
                <div class="float-right">
                  <b-button
                    v-b-tooltip.hover="'Gift'"
                    :disabled="
                      cardsBeingGifted[card.id] || cardsBeingSacrificed[card.id]
                    "
                    class="btn btn-danger btn-gift"
                    @click="openGiftModal(card.id)"
                  >
                    <b-icon-gift style="color: white" />
                  </b-button>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <b-table
              :items="orderedCards"
              :fields="tableFields"
              small
              striped
              responsive
            >
              <template #cell(name)="row">
                <div class="cell">
                  <img
                    :src="row.item.image"
                    :class="`cell mr-4 ${row.item.rarity}`"
                  />
                  {{ row.item.name }}
                </div>
              </template>
              <template #cell(card_level)="row">
                <div class="cell">
                  {{ row.item.card_level }}
                </div>
              </template>
              <template #cell(edition_number)="row">
                <div class="cell">
                  {{ row.item.edition_label }}
                </div>
              </template>
              <template #cell(unlock_czxp)="row">
                <div class="cell">
                  {{ parseInt(row.item.unlock_czxp).toLocaleString() }}
                </div>
              </template>
              <template #cell(sacrifice_czxp)="row">
                <div class="cell">
                  {{ parseInt(row.item.sacrifice_czxp).toLocaleString() }}
                </div>
              </template>
              <template #cell(transfer_czxp)="row">
                <div class="cell">
                  {{ parseInt(row.item.transfer_czxp).toLocaleString() }}
                </div>
              </template>
              <template #cell(sacrifice)="row">
                <div v-if="!isOthersCrypt" class="cell">
                  <b-button
                    size="md"
                    variant="danger"
                    :disabled="
                      cardsBeingGifted[row.item.id] ||
                      cardsBeingSacrificed[row.item.id]
                    "
                    @click="sacrificeCard(row.item.id)"
                  >
                    <span class="emoji">☠️</span>
                  </b-button>
                </div>
              </template>
              <template #cell(gift)="row">
                <div v-if="!isOthersCrypt" class="cell">
                  <b-button
                    size="md"
                    variant="danger"
                    :disabled="
                      cardsBeingGifted[row.item.id] ||
                      cardsBeingSacrificed[row.item.id]
                    "
                    @click="openGiftModal(row.item.id)"
                  >
                    <!--img src="@/assets/baseline_card_giftcard_white_24dp.png" /-->
                    <b-icon-gift-fill />
                  </b-button>
                </div>
              </template>
            </b-table>
          </div>
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
            your wallet.
          </h2>
        </div>
        <div v-if="(isWalletConnected || isOthersCrypt) && !ownsCards">
          <h2 v-if="!isOthersCrypt">
            You do not own any Cryptoz<br /><router-link to="/shop">
              To get Free Cryptoz NFTs or Buy one, visit the Minting Shop
            </router-link>
          </h2>
          <h2 v-else>No Avaliable NFTs</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { isAddress } from "../util/addressUtil";
import getCardTypes from "../util/getCardType";
import SortDropdown from "@/components/SortDropdown.vue";
import OwnedCardContent from "@/components/OwnedCardContent";
import { getRarity, dynamicSort } from "../helpers";
import {
  showSuccessToast,
  showPendingToast,
  showRejectedToast,
} from "../util/showToast";
import {
  BButton,
  BInputGroup,
  BFormInput,
  BInputGroupAppend,
  BSpinner,
  BTable,
} from "bootstrap-vue";
import dAppStates from "@/dAppStates";
import { MessageBus } from "@/messageBus";

export default {
  name: "CardsContainer",
  components: {
    SortDropdown,
    OwnedCardContent,
    BButton,
    BInputGroup,
    BFormInput,
    BInputGroupAppend,
    BSpinner,
    BTable,
  },
  props: {
    addressToLoad: {
      type: String,
      default: null,
    },
    isOthersCrypt: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["cryptChanged"],
  data() {
    return {
      cardsBeingGifted: {},
      cardsBeingSacrificed: {},
      isLoading: false,
      orderedCards: [],
      ownsCards: false,
      sortType: null,
      isDescending: true,
      isTableView: false,
      addressToSearch: null,
      disableSearch: true,
    };
  },
  computed: {
    coinbase() {
      return this.$store.state.web3.coinbase;
    },
    dAppState() {
      return this.$store.state.dAppState;
    },
    isWalletConnected() {
      return this.$store.state.dAppState === dAppStates.WALLET_CONNECTED;
    },
    CryptozInstance() {
      return this.$store.state.contractInstance.cryptoz;
    },
    addressToSearchState() {
      return isAddress(this.addressToSearch);
    },
    tableFields() {
      if (this.isOthersCrypt) {
        return [
          "name",
          "card_level",
          "edition_number",
          "unlock_czxp",
          "sacrifice_czxp",
          "transfer_czxp",
        ];
      } else {
        return [
          "name",
          "card_level",
          "edition_number",
          "unlock_czxp",
          "sacrifice_czxp",
          "transfer_czxp",
          "sacrifice",
          "gift",
        ];
      }
    },
    currentEvent() {
      return this.$store.state.lastChainEvent;
    },
    getMyCryptLink() {
      const url =
        process.env.NODE_ENV == "development"
          ? "localhost:8080"
          : "https://bsc.cryptoz.cards";
      return `${url}/my-cryptoz-nfts/${this.coinbase}`;
    },
  },
  watch: {
    CryptozInstance(newVal) {
      if (newVal && this.addressToLoad) {
        this.getAllCards(this.addressToLoad);
      }
    },
    currentEvent(newVal) {
      if (newVal) {
        this.getAllCards(this.addressToLoad);
      }
    },
    isWalletConnected(val) {
      if (val) {
        this.getAllCards(this.addressToLoad);
      }
    },
    addressToSearch: function (newVal, oldVal) {
      const isSearchAddressValid = isAddress(newVal.toLowerCase());
      if (isSearchAddressValid) {
        this.disableSearch = false;
      } else {
        this.disableSearch = true;
      }
    },
    addressToLoad: function (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.getAllCards(newVal);
      }
    },
  },
  mounted() {
    if (this.CryptozInstance) {
      this.getAllCards(this.addressToLoad);
    }
  },
  methods: {
    addHashToLocation(params) {
      const currentPath = this.$route.path;
      const newPath = currentPath.substring(
        0,
        currentPath.indexOf("my-cryptoz-nfts")
      );
      history.pushState({}, null, newPath + `${params}`);
    },
    clearCards: function () {
      this.orderedCards = [];
      this.ownsCards = false;
    },
    toggleTableView: function () {
      const nextVal = !this.isTableView;
      this.isTableView = nextVal;
    },
    searchNewCrypt: function () {
      if (this.isOthersCrypt) {
        this.isLoading = true;
        this.clearCards();
        this.addHashToLocation(`my-cryptoz-nfts/${this.addressToSearch}`);
        this.getAllCards(this.addressToSearch);
        this.$emit("cryptChanged", this.addressToSearch);
      } else {
        this.navigateToNewCrypt();
      }
    },
    openGiftModal: function (id) {
      const h = this.$createElement;
      const titleVNode = h(
        "h5",
        `Gift Cryptoz NFT Token #${id} to another address`,
        { class: ["modal-title"] }
      );
      const messageVNode = h("div", { class: ["modal-message"] }, [
        h("p", "Enter a valid BSC wallet address to send this card to:", {
          class: [""],
        }),
        h("input", {
          on: { input: (e) => (this.receivingWallet = e.target.value) },
          props: {
            id: "toWallet",
          },
          style: {
            width: "100%",
          },
        }),
      ]);
      // We must pass the generated VNodes as arrays
      this.$bvModal
        .msgBoxConfirm([messageVNode], {
          title: [titleVNode],
          buttonSize: "md",
          centered: true,
          size: "md",
          id: "gift-modal",
        })
        .then((value) => {
          if (value) {
            // user pressed ok
            this.transferCard(id);
          } else {
            // user canceled
          }
        })
        .catch((err) => {
          // An error occurred
          console.error(err);
        });
    },
    navigateToNewCrypt: function () {
      this.$router.push(`/my-cryptoz-nfts/${this.addressToSearch}`);
    },
    getAllCards: async function (addressToLoad) {
      if (!this.isOthersCrypt && !this.isWalletConnected) {
        return;
      }
      this.isLoading = true;
      const tokensOfOwner = await this.CryptozInstance.methods
        .tokensOfOwner(addressToLoad)
        .call();

      console.log({ tokensOfOwner });
      this.handleGetAllCards(tokensOfOwner, this.CryptozInstance);
      this.isLoading = false;
    },
    sacrificeCard: async function (id) {
      this.$store.dispatch("setIsTransactionPending", true);
      Vue.set(this.cardsBeingSacrificed, id, true);
      const sacrificeRes = await this.CryptozInstance.methods
        .sacrifice(id)
        .send({ from: this.coinbase }, (err, txHash) => {
          this.$store.dispatch("setIsTransactionPending", false);

          if (err) {
            Vue.set(this.cardsBeingSacrificed, id, false);
          }
        })
        .catch((err) => {
          if (err.code !== 4001) {
            console.log(err);
            Vue.set(this.cardsBeingSacrificed, id, false);
            showErrorToast(this, "Failed to sacrifice card");
          }
        });

      if (sacrificeRes) {
        this.orderedCards = this.orderedCards.filter((card) => card.id !== id);
        showSuccessToast(this, "Card sacrificed.");
      }
    },
    transferCard: async function (id) {
      Vue.set(this.cardsBeingGifted, id, true);
      this.$store.dispatch("setIsTransactionPending", true);

      const giftRes = await this.CryptozInstance.methods
        .transferFrom(this.coinbase, this.receivingWallet, id)
        .send({ from: this.coinbase }, (err, txHash) => {
          this.$store.dispatch("setIsTransactionPending", false);
        })
        .catch((err) => {
          if (err.code !== 4001) {
            console.log("Error: ", err);
          }
        })
        .finally(() => {
          Vue.set(this.cardsBeingGifted, id, false);
        });

      if (giftRes) {
        this.orderedCards = this.orderedCards.filter((card) => card.id !== id);
        showSuccessToast(this, "Card Gifted.");
      }
    },
    handleGetAllCards: async function (tokensOfOwner, instance) {
      if (tokensOfOwner.length > 0) {
        this.ownsCards = true;

        //Place to track our token array data
        let tokenIdList = {};

        const getCard = async (tokenId) => {
          try {
            const ownedCard = await instance.methods
              .getOwnedCard(tokenId)
              .call();

            tokenIdList[tokenId] = ownedCard;
            const cardData = await getCardTypes(parseInt(ownedCard[0]));

            cardData.id = tokenId;
            let newAttr = {};

            cardData.attributes.forEach((attribute) => {
              newAttr[attribute.trait_type] = attribute.value;
            });

            cardData.attributes = newAttr;
            cardData.attributes.edition_current = parseInt(
              tokenIdList[tokenId][1]
            );

            if (cardData.attributes.edition_total == 0) {
              //unlimited
              cardData.attributes.edition_label =
                "#" + cardData.attributes.edition_current;
            } else {
              cardData.attributes.edition_label =
                "#" +
                cardData.attributes.edition_current +
                " of " +
                cardData.attributes.edition_total;
            }

            switch (cardData.attributes.rarity) {
              case "Common":
                cardData.attributes.rarity = "card-bg card-bg-6";
                break;
              case "Uncommon":
                cardData.attributes.rarity = "card-bg card-bg-5";
                break;
              case "Rare":
                cardData.attributes.rarity = "card-bg card-bg-4";
                break;
              case "Epic":
                cardData.attributes.rarity = "card-bg card-bg-3";
                break;
              case "Platinum":
                cardData.attributes.rarity = "card-bg card-bg-2";
                break;
              case "Diamond":
                cardData.attributes.rarity = "card-bg card-bg-1";
                break;
            }

            newAttr = { ...newAttr, ...cardData };
            delete newAttr.attributes;

            return newAttr;
          } catch (error) {
            throw error;
          }
        };

        this.orderedCards = await Promise.all(
          tokensOfOwner.map((token) => getCard(parseInt(token)))
        ).catch((err) => {
          console.error("Failed to fetch cards.", err);
          this.clearCards();
          return;
        });

        this.orderedCards.sort((a, b) => b.id - a.id);

        if (this.sortType) {
          this.sortByAttr(this.sortType, this.isDescending);
        }
      } else {
        console.log("no cards returned from handleGetAllCards()");
        this.ownsCards = false;
      }
    },
    sortByAttr: function (param, isDescending) {
      if (!param) {
        // clear sort
        this.orderedCards.sort((a, b) => b.id - a.id);
        this.sortType = null;
        this.isDescending = true;
        return;
      }

      this.sortType = param;
      this.isDescending = isDescending;

      switch (param) {
        case "edition_number":
          this.orderedCards.sort(
            dynamicSort("edition_current", isDescending, false)
          );
          break;
        case "rarity":
          this.orderedCards.sort(
            dynamicSort(param, isDescending, true, getRarity)
          );
          break;
        default:
          this.orderedCards.sort(dynamicSort(param, isDescending));
          break;
      }
    },
    goBackToMyCrypt: function () {
      this.$router.push("/my-cryptoz-nfts");
    },
    copyMyCryptLink: function () {
      const textToCopy = this.$refs.myCrypt.value;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          showSuccessToast(this, "Link Copied.");
        })
        .catch((error) => {
          console.log("Copy Failed: ", error);
        });
    },
    onConnect: function () {
      MessageBus.$emit("connect");
    },
  },
};
</script>

<style scoped lang="scss">
#button-container {
  display: flex;
  margin-bottom: 2rem;
  flex-direction: column;
}

#view-change-button {
  margin-left: 0.5rem;
}

.loading {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 36px;
}

.wrapper {
  display: flex;
  flex-direction: column;
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

.crypt-search-input-group {
  max-width: 500px;
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

table {
  .cell {
    min-height: 60px;

    display: flex;
    flex-direction: row;
    align-items: center;

    img {
      height: 60px;
    }
  }
}

.sacrifice-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.cards-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(calc(0.55 * 260px), 1fr));
  place-items: center;
}

/* Desktop CSS */
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

  .cards-wrapper {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
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
