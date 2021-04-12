<template>
  <div>
    <main role="main" class="container">
      <div class="jumbotron">
        <div v-if="load_state == -1" class="row">
          <div class="col">
            <h2>Loading....please wait</h2>
          </div>
        </div>
        <div v-else-if="load_state == 0" class="row">
          <div class="col">
            <h2>Cryptoz Token #{{ token_id }} does not exist on this chain</h2>
            <p>If you would like to see a token:</p>
            <button class="btn btn-primary" @click="go_genesis">
              View The CryptoKeeper - our #0 Genesis token
            </button>
          </div>
        </div>
        <div v-else id="container" class="row">
          <div id="card-wrapper">
            <OwnedCardContent
              :id="card.id"
              :key="card.id"
              :type_id="card.attributes.type_id"
              :name="card.name"
              :cost="card.attributes.cost"
              :cset="card.attributes.card_set"
              :edition_current="edition_current"
              :edition_total="card.attributes.edition_total"
              :level="card.attributes.card_level"
              :unlock_czxp="card.attributes.unlock_czxp"
              :buy_czxp="card.attributes.buy_czxp"
              :transfer_czxp="card.attributes.transfer_czxp"
              :sacrifice_czxp="card.attributes.sacrifice_czxp"
              :image="card.image"
              :card_class="card.attributes.rarity"
              :in_store="card.attributes.in_store"
              :card_owned="true"
              :is_single_card_view="true"
            />
          </div>
          <div id="stats-container" class="col">
            <div class="flex-row">
              <div class="text-right font-weight-bold label">Owner:</div>
              <div>
                <a class="wrap-text" :href="owner_url" target="_blank">{{
                  owner
                }}</a>
              </div>
            </div>
            <div class="flex-row">
              <div class="text-right font-weight-bold label">
                Cryptoz Token #:
              </div>
              <div class="">
                {{ token_id }}
              </div>
            </div>
            <div class="flex-row">
              <div class="text-right font-weight-bold label">Editon:</div>
              <div class="">
                {{ edition_current }}
              </div>
            </div>
            <div class="flex-row">
              <div class="text-right font-weight-bold label">
                Times Transferred:
              </div>
              <div class="">
                {{ times_transferred }}
              </div>
            </div>
            <div class="flex-row">
              <div class="text-right font-weight-bold label">Card Name:</div>
              <div class="">
                {{ card.name }}
              </div>
            </div>
            <div class="flex-row">
              <div class="text-right font-weight-bold label">Card Set:</div>
              <div class="">
                {{ card.attributes.card_set }}
              </div>
            </div>
            <div class="flex-row">
              <div class="text-right font-weight-bold label">Zombie Type:</div>
              <div class="">
                {{ card.attributes.zombie_type }}
              </div>
            </div>
            <div class="flex-row">
              <div class="text-right font-weight-bold label">Rarity:</div>
              <div class="">
                {{ rarity }}
              </div>
            </div>
            <div class="flex-row">
              <div class="text-right font-weight-bold label">Cost:</div>
              <div class="">
                {{ card.attributes.cost }}
              </div>
            </div>
            <div class="flex-row">
              <div class="text-right font-weight-bold label">Buy CZXP:</div>
              <div class="">
                {{ card.attributes.buy_czxp }}
              </div>
            </div>
            <div class="flex-row">
              <div class="text-right font-weight-bold label">
                Transfer CZXP:
              </div>
              <div class="">
                {{ card.attributes.transfer_czxp }}
              </div>
            </div>
            <div class="flex-row">
              <div class="text-right font-weight-bold label">
                Sacrifice CZXP:
              </div>
              <div class="">
                {{ card.attributes.sacrifice_czxp }}
              </div>
            </div>
            <div class="flex-row">
              <div class="text-right font-weight-bold label">Unlock CZXP:</div>
              <div class="">
                {{ card.attributes.unlock_czxp }}
              </div>
            </div>
            <div class="flex-row">
              <div class="text-right font-weight-bold label">Level:</div>
              <div class="">
                {{ card.attributes.card_level }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from "axios";
import OwnedCardContent from "@/components/OwnedCardContent.vue";
import dAppStates from "@/dAppStates";

export default {
  name: "TokenContent",
  components: {
    OwnedCardContent,
  },
  data() {
    return {
      load_state: -1, //This is the loading state, -1 = loading state,0 - token doesn't exist, 1 = token is valid
      owner: "Loading..",
      token_id: "",
      card: {
        name: "Loading...",
        description: "Loading...",
        attributes: {
          rarity: "Loading...",
          edition_total: "Loading...",
          cost: "Loading...",
          card_set: "Loading...",
          zombie_type: "Loading...",
          buy_czxp: "Loading...",
          transfer_czxp: "Loading...",
          sacrifice_czxp: "Loading...",
          unlock_czxp: "Loading...",
          card_level: "Loading...",
        },
      },
      owner_url: "",
      rarity: "",
      times_transferred: "Loading..",
      edition_current: "Loading...",
      etherscan_token_id: "https://etherscan.com/contract/token/",
    };
  },
  computed: {
    CryptozInstance() {
      return this.$store.state.contractInstance.cryptoz;
    },
    isDAppConnected() {
      return (
        this.$store.state.dAppState === dAppStates.CONNECTED ||
        this.$store.state.dAppState === dAppStates.WALLET_CONNECTED
      );
    },
    coinbase() {
      return this.$store.state.web3.coinbase;
    },
  },
  watch: {
    isDAppConnected(value) {
      if (value) {
        this.loadCard(this.token_id);
      }
    },
  },
  mounted() {
    //grab the token id from the url
    this.token_id = parseInt(this.$route.params.token_id);

    if (this.isDAppConnected) {
      console.log("from mount");
      this.loadCard(this.token_id);
    }
  },
  methods: {
    loadCard: async function (token_id) {
      const res = await this.CryptozInstance.methods
        .getOwnedCard(token_id)
        .call()
        .catch((err) => console.log({ err }));

      //returns TypeId, Edition, # times transfed
      // console.log("CardOwned results:", res);
      let cardTypeId = parseInt(res[0]);

      //If the tokenId is greater than 0, we have something valid
      if (cardTypeId === 0) {
        this.load_state = 0;
        return;
      }

      this.edition_current = parseInt(res[1]);
      this.times_transferred = parseInt(res[2]);
      this.getCardData(cardTypeId);
      const owner = await this.CryptozInstance.methods.ownerOf(token_id).call();
      this.owner = owner;
      this.owner_url = "https://etherscan.io/addowners/" + owner;
    },
    getCardData: function (card_id) {
      axios
        .get(
          "https://cryptoz.cards/services/getCardData.php?card_id=" + card_id
        )
        .then(this.handleGotCardData);
    },
    handleGotCardData: function (res) {
      //console.log(res.data);

      var newAttr = [];
      //format the attributes to match our JS objects
      res.data.attributes.forEach(function (element) {
        newAttr[element.trait_type] = element.value;
      });

      //Overwrite our JSON reponse with vue friendly card binding data
      res.data.attributes = newAttr;

      //Set human readable edition number and total
      // if (res.data.attributes.edition_total == 0) {
      //   //unlimited
      //   res.data.attributes.edition_total = "#" + this.edition_current;
      // } else {
      //   res.data.attributes.edition_total =
      //     "#" +
      //     this.edition_current +
      //     " of " +
      //     res.data.attributes.edition_total;
      // }

      //Get the human label for rarity
      this.rarity = res.data.attributes.rarity;

      //Append the bg
      switch (res.data.attributes.rarity) {
        case "Common":
          res.data.attributes.rarity = "card-bg card-bg-6";
          break;
        case "Uncommon":
          res.data.attributes.rarity = "card-bg card-bg-5";
          break;
        case "Rare":
          res.data.attributes.rarity = "card-bg card-bg-4";
          break;
        case "Epic":
          res.data.attributes.rarity = "card-bg card-bg-3";
          break;
        case "Diamond":
          res.data.attributes.rarity = "card-bg card-bg-2";
          break;
        case "Platinum":
          res.data.attributes.rarity = "card-bg card-bg-1";
          break;
      }

      if (res.data.attributes.edition_total === 0) {
        res.data.attributes.cost = "Booster Only";
      }

      this.card = res.data;
      this.load_state = 1;
    },
    go_genesis: function () {
      this.token_id = 0;
      this.startSubscriptions();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#container {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
}

#stats-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.flex-row {
  display: flex;
}

.flex-row > * {
  flex: 1;
  min-width: 0;
}

.wrap-text {
  word-wrap: break-word;
}

.centered {
  display: flex;
  align-items: center;
}

.label {
  max-width: 200px;
  margin-right: 10px;
}

#card-wrapper {
  display: flex;
  justify-content: center;
}
</style>
