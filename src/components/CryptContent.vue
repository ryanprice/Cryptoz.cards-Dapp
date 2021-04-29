<template>
  <div>
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
        <router-link to="/help?read-cards"> Random odds explained </router-link>
        <b-form-input
          v-model="wagerAmount"
          class="form-control"
          :state="isWagerValid"
          required
          type="number"
        />
        <b-form-invalid-feedback v-if="isWagerValid">
          <div>
            You need to enter a number between 2,000,000,000 and
            1,649,267,441,667,000 to wager.
          </div>
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!hasEnoughCZXP">
          <div>You do not have enough CZXP tokens</div>
        </b-form-invalid-feedback>
        <b-row>
          <b-col>
            <b-button
              v-b-tooltip.hover="'Open Booster'"
              class="mt-3"
              variant="danger"
              block
              :disabled="!isWagerValid"
              @click="openBooster"
            >
              Mint random NFT
            </b-button>
          </b-col>
          <b-col>
            <b-button
              class="mt-3"
              block
              @click="$bvModal.hide('open-booster-modal')"
            >
              Cancel
            </b-button>
          </b-col>
        </b-row>
      </b-modal>

      <b-modal
        id="open-probability-modal"
        title="Booster Minting Probability by Rarity"
        header-bg-variant="warning"
        centered
        hide-footer
        size="lg"
      >
        <div class="probablity-modal">
          <h4>
            The probabilities of minting by rarity are hard coded in the Cryptoz
            contract and will never change
          </h4>
          <div class="cards-image-container">
            <div class="booster-card-wrapper">
              <img
                src="https://cryptoz.cards/assets/cryptoz_card_epic_purple.svg"
              />
              <span class="rarity-text">Epic</span>
              <span class="prob-text">0.01%</span>
            </div>
            <div class="booster-card-wrapper">
              <img
                src="https://cryptoz.cards/assets/cryptoz_card_rare_red.svg"
              />
              <span class="rarity-text">Rare</span>
              <span class="prob-text">0.50%</span>
            </div>
            <div class="booster-card-wrapper">
              <img
                src="https://cryptoz.cards/assets/cryptoz_card_uncommon_blue.svg"
              />
              <span class="rarity-text uncommon">Uncommon</span>
              <span class="prob-text">26.5%</span>
            </div>
            <div class="booster-card-wrapper">
              <img
                src="https://cryptoz.cards/assets/cryptoz_card_common_brown.svg"
              />
              <span class="rarity-text common">Common</span>
              <span class="prob-text">73.0%</span>
            </div>
          </div>
        </div>
      </b-modal>

      <div class="jumbotron">
        <UniverseBalances />

        <h1>Your NFT Wallet</h1>
        <p>
          This is where all your NFT Cryptoz tokens can be accessed. Sort,
          search, gift and sacrifice. Sacrificing is permanent, not only in your
          wallet but across the entire Cryptoz Universe. That unique NFT is
          burned forever.
        </p>

        <!-- Loads cards here -->
        <div v-if="isWalletConnected" class="action-buttons">
          <div>
            <b-button
              v-b-tooltip.hover="'Mint 1 random booster NFT'"
              class="mint-booster-btn btn btn-danger"
              :disabled="boostersOwned < 1"
              @click="openBooster"
              >Mint <b-icon-lightning-fill /> Booster NFT
            </b-button>
          </div>
          <div>
            <b-button
              v-b-tooltip.hover="'View probability of mint by rarity'"
              class="btn" variant="info"
              v-b-modal="'open-probability-modal'"
            >
              <b-icon-pie-chart-fill />
            </b-button>
          </div>
          <div class="buy-and-open-booster">
            <b-button
              v-b-tooltip.hover="'Mint 1 random booster NFT +120 CZXP'"
              class="btn btn-danger"
              :disabled="balance < 2000000000000000"
              @click="buyAndOpenBooster"
            >
              Buy and Mint <b-icon-lightning-fill /> Booster NFT 0.002 BNB
            </b-button>
          </div>
        </div>
        <br />

        <OwnerBalances />
        <div class="cards-wrapper">
          <cards-container
            :is-others-crypt="false"
            :address-to-load="coinbase"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UniverseBalances from "@/components/UniverseBalances.vue";
import OwnerBalances from "@/components/OwnerBalances.vue";
import CardsContainer from "./CardsContainer.vue";
import {
  BFormInput,
  BFormInvalidFeedback,
  BRow,
  BCol,
  BButton,
  BImg,
  BContainer,
} from "bootstrap-vue";
import { showErrorToast } from "../util/showToast";
import dAppStates from "@/dAppStates";
import { MessageBus } from "@/messageBus";

export default {
  name: "CryptContent",
  components: {
    UniverseBalances,
    OwnerBalances,
    CardsContainer,
    BFormInput,
    BFormInvalidFeedback,
    BRow,
    BCol,
    BButton,
    BImg,
    BContainer,
  },
  data() {
    return {
      wagerAmount: 0,
      receivingWallet: "",
    };
  },
  computed: {
    balance() {
      return this.$store.state.web3.balance;
    },
    coinbase() {
      return this.$store.state.web3.coinbase;
    },
    CryptozInstance() {
      return this.$store.state.contractInstance.cryptoz;
    },
    isWalletConnected() {
      return this.$store.state.dAppState === dAppStates.WALLET_CONNECTED;
    },
    boostersOwned() {
      return this.$store.state.boostersOwned;
    },
    isWagerValid() {
      const wagerAmount = parseInt(this.wagerAmount);

      if (wagerAmount === 0) {
        return true;
      }

      if (this.czxp_balance < wagerAmount) {
        return false;
      }

      return wagerAmount >= 2000000000 && wagerAmount <= 1649267441667000;
    },
    hasEnoughCZXP() {
      const wagerAmount = parseInt(this.wagerAmount);
      if (wagerAmount > 0) {
        return this.czxp_balance < wagerAmount;
      }

      return true;
    },
    czxp_balance() {
      return this.$store.state.czxpBalance;
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
    coinbase(val, oldVal) {
      if (val !== oldVal) {
        this.$bvModal.hide("gift-modal");
        this.$bvModal.hide("open-booster-modal");
      }
    },
  },
  methods: {
    buyAndOpenBooster: async function () {
      try {
        this.$store.dispatch("setIsTransactionPending", true);
        const res = await this.CryptozInstance.methods
          .buyBoosterCardAndOpen()
          .send(
            {
              from: this.coinbase,
              value: 2000000000000000,
            },
            (err, txHash) => {
              this.$store.dispatch("setIsTransactionPending", false);
            }
          );

        const newCard = await this.$store.dispatch("crypt/addBoosterCard", {
          cardId: res.events.LogCardCreated.returnValues.cardTokenId,
        });
        MessageBus.$emit("boosterOpened", newCard);
      } catch (err) {
        console.error(err);
        showErrorToast(this, "Failed to buy/open booster");
      } finally {
        this.$bvModal.hide("open-booster-modal");
      }
    },
    openBooster: async function () {
      try {
        this.$store.dispatch("setIsTransactionPending", true);
        this.$bvModal.hide("open-booster-modal");

        const res = await this.CryptozInstance.methods
          .openBoosterCard(0)
          .send({ from: this.coinbase }, (err, transactionHash) => {
            this.$store.dispatch("setIsTransactionPending", false);
          });

        const newCard = await this.$store.dispatch("crypt/addBoosterCard", {
          cardId: res.events.LogCardCreated.returnValues.cardTokenId,
        });
        MessageBus.$emit("boosterOpened", newCard);
      } catch (err) {
        console.error(err);
        showErrorToast(this, "Failed to open booster");
      }
    },
    openProbabilityModal: function () {
      console.log("Hey hey");
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

<style scoped lang="scss">
.action-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media screen and (min-width: 600px) {
    flex-direction: row;
    justify-content: space-between;
  }

  div {
    margin-top: 16px;

    button {
      min-width: 200px;
      max-width: 200px;

      @media screen and (min-width: 600px) {
        min-width: fit-content;
      }
    }
  }
}

.jumbotron {
  margin: auto;
  width: 95%;
}

.buy-and-open-booster {
  display: flex;
}

#open-booster-modal div {
  margin-bottom: 10px;
}

.cards-wrapper {
  margin-top: 24px;
}

.cards-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media screen and (min-width: 800px) {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .booster-card-wrapper {
    position: relative;
    width: 250px;

    @media screen and (min-width: 800px) {
      width: 300px;
    }

    img {
      width: 100%;
    }

    .rarity-text {
      color: white;
      font-size: 22px;
      font-weight: bold;
      text-align: center;
      position: absolute;
      right: 41%;
      top: 61%;

      @media screen and (min-width: 800px) {
        right: 43%;
      }
    }

    .prob-text {
      color: white;
      font-size: 48px;
      position: absolute;
      top: 26%;
      left: 28%;
      text-align: center;

      @media screen and (min-width: 800px) {
        top: 30%;
        left: 30%;
      }
    }

    .uncommon {
      right: 24%;

      @media screen and (min-width: 800px) {
        right: 28%;
      }
    }
    .common {
      right: 32%;

      @media screen and (min-width: 800px) {
        right: 34%;
      }
    }
  }
}

.probablity-modal {
  padding: 0 12px;
  width: 100%;

  h4 {
    text-align: center;
    margin-bottom: 16px;
  }
}

.mint-booster-btn {
  min-height:62px;
}
</style>
