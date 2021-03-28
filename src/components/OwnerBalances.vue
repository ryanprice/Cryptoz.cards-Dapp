<template>
  <div class="row-col">
    <p>
      <strong>Your <b-icon-lightning-fill /> Booster credits :</strong> {{boosters_owned}}
    </p>
    <p><strong>Your Cryptoz NFTs :</strong> {{cards_owned}}</p>
    <p><strong>Your CZXP <img class="czxp-logo" src="./assets/cryptokeeper_coin_binance.svg" align="middle" /> Balance :</strong> {{czxp_balance}}</p>
  </div>
</template>
<script>
  import {ownerBalances} from 'vuex'

  export default {
    name: 'OwnerBalances',
    computed: {
      ownerBalances() {
        return this.$store.state.ownerBalances;
      },
      boosters_owned(){
        return this.$store.state.boostersOwned;
      },
      cards_owned(){
        return this.$store.state.cardsOwned;
      },
      czxp_balance(){
        return this.$store.state.czxpBalance;
      },
      coinbase() {
        return this.$store.state.web3.coinbase;
      },
    },
    watch: {
      coinbase(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.$store.dispatch('updateOwnerBalances')
        }
      }
    },
  }

</script>
<style scoped>
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
