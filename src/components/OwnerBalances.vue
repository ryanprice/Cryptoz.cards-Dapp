<template>
  <div id="container" class="row-col" v-if="isWalletConnected">
    <p>
      <strong>Your <b-icon-lightning-fill /> Booster credits :</strong> {{boosters_owned}}
    </p>
    <p><strong>Your Cryptoz NFTs :</strong> {{cards_owned}}</p>
    <p><strong>Your CZXP <img class="czxp-logo" src="./assets/cryptokeeper_coin_binance.svg" align="middle" /> Balance :</strong> {{czxp_balance}}</p>
  </div>
</template>
<script>
  import dAppStates from '@/dAppStates'

  export default {
    name: 'OwnerBalances',
    computed: {
      isWalletConnected() {
        return this.$store.state.dAppState === dAppStates.WALLET_CONNECTED;
      },
      ownerBalances() {
        return this.$store.state.ownerBalances;
      },
      boosters_owned(){
        return this.$store.state.boostersOwned.toLocaleString();
      },
      cards_owned(){
        return this.$store.state.cardsOwned.toLocaleString();
      },
      czxp_balance(){
        return this.$store.state.czxpBalance.toLocaleString();
      },
      coinbase() {
        return this.$store.state.web3.coinbase;
      },
    },
  }

</script>
<style scoped>
  #container {
    margin: 20px 0;
  }

  p {
    padding-left: 10px;
    margin-bottom: 0;
  }
  
  .czxp-logo {
    width: 20px;
  }

  .row-col {
    display: flex;
    flex-direction: column;
  }

  @media screen and (min-width: 600px) {
    .row-col {
      flex-direction: row;
      justify-content: space-between;
    }
  }
</style>
