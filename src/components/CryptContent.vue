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
        <div v-if="isWalletConnected" class="row">
          <div class="col">
            <b-button
              v-b-tooltip.hover="'Mint 1 random booster NFT'"
              class="btn btn-danger"
              :disabled="boostersOwned < 1"
              @click="openBooster"
              >Open <b-icon-lightning-fill /> Booster Card
            </b-button>
          </div>
          <div class="col buy-and-open-booster">
            <b-button
              v-b-tooltip.hover="'Mint 1 random booster NFT +120 CZXP'"
              class="btn btn-danger"
              :disabled="balance < 2000000000000000"
              @click="buyAndOpenBooster"
            >
              Buy and Open <b-icon-lightning-fill /> Booster 0.002 BNB
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

<style scoped>
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
</style>
