<template>
  <div class="jumbotron">
    <universe-balances />
    <div class="description">
      <h1>NFT Wallet</h1>
      <h2 class="text-danger">
        Viewing <img src="@/assets/metamask-face.png" class="header-icon" />
        {{ addressToLoad.substr(0, 6) + "..." + addressToLoad.substr(38) }}
      </h2>
      <p>
        This is where you can see other person's NFT Cryptoz tokens. You can
        sort, and view them in a table. But you will not be able to perform any
        actions on the NFTs.
      </p>
    </div>

    <cards-container
      :is-others-crypt="true"
      :address-to-load="addressToLoad"
      @cryptChanged="handleAddressChanged"
    />
  </div>
</template>

<script>
import CardsContainer from "@/components/CardsContainer.vue";
import UniverseBalances from "./UniverseBalances.vue";

export default {
  name: "OthersCryptContent",
  components: {
    CardsContainer,
    UniverseBalances,
  },
  data() {
    return {
      addressToLoad: null,
    };
  },
  computed: {
    coinbase() {
      return this.$store.state.web3.coinbase;
    },
  },
  created() {
    this.addressToLoad = this.$route.params.address;
  },
  methods: {
    handleAddressChanged(value) {
      this.addressToLoad = value;
    },
  },
};
</script>

<style>
.jumbotron {
  margin: auto;
  width: 95%;
}

.description {
  margin-bottom: 16px;
}

.header-icon {
  height: 20px;
}
</style>
