<template>

  <b-row>
    <b-col>
      <strong>Your <b-icon-lightning-fill /> Booster credits :</strong> {{boosters_owned}}
    </b-col>
    <b-col class="text-center">
      <strong>Your Cryptoz NFTs :</strong> {{cards_owned}}
    </b-col>
    <b-col class="text-right">
      <strong>Your CZXP <img class="czxp-logo" src="./assets/cryptokeeper_coin_binance.svg" align="middle" /> Balance :</strong> {{parseInt(czxp_balance).toLocaleString()}}
    </b-col>
  </b-row>

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
      ownerBalances(newValue, oldValue) {
        // new balances.. reset their boosters, cards and czxp balance
        if (newValue !== oldValue) {
          this.setSubscriptions();
        }
      }
    },
    mounted () { //Initialize the component
        this.setSubscriptions();
    },
    data () {
      return {

      }
    },
    methods : {
      setSubscriptions : function() {
        CzxpToken.deployed().then((instance) => {
          return instance.balanceOf(this.coinbase);
        }).then(this.setCzxpBalance)
        Cryptoz.deployed().then((instance) => {
          return instance.tokensOfOwner(this.coinbase);
        }).then(this.setCryptozBalance)
        Cryptoz.deployed().then((instance) => {
          return instance.boosterPacksOwned(this.coinbase);
        }).then(this.setBoostersOwned)
      },
      setCzxpBalance: function(balance){
        this.$store.dispatch('updateCZXPBalance', balance)
      },
      setCryptozBalance: function(tokens) {
        this.$store.dispatch('updateCardsOwned', tokens.length)
      },
      setBoostersOwned: function(boostersOwned){
        this.$store.dispatch('updateBoostersOwned', parseInt(boostersOwned).toLocaleString())
      },
    }
  }

</script>
<style scoped>
.czxp-logo {
  width : 4%;
  vertical-align:middle;
}
</style>
