<template>
  
  <b-row>
    <b-col>
      <strong>Your Boosters :</strong> {{boosters_owned}}
    </b-col>
    <b-col class="text-center">
      <strong>Your Cryptoz:</strong> {{cards_owned}}
    </b-col>
    <b-col class="text-right">
      <strong>Your CZXP Balance :</strong> {{parseInt(czxp_balance).toLocaleString()}}
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
        console.log(`Updating ownerBalances from ${oldValue} to ${newValue}`);
  
        // new balances.. reset their boosters, cards and czxp balance
        if (newValue !== oldValue) {
          this.setSubscriptions();
        }
      },
    },
    mounted () { //Initialize the component
    
    },
    data () {
      return {
        
      }
    },
    methods : {
      setSubscriptions : function() {
        var self = this;
        
        CzxpToken.deployed().then(function(instance) {
          return instance.balanceOf(self.coinbase);
        }).then(this.setCzxpBalance)
        
        Cryptoz.deployed().then(function(instance) {
          // console.log("get cryptoz cards tokens balance...");
          return instance.tokensOfOwner(self.coinbase);
        }).then(this.setCryptozBalance)
        
        Cryptoz.deployed().then(function(instance) {
          return instance.boosterPacksOwned(self.coinbase);
        }).then(this.setBoostersOwned)
      },
      setCzxpBalance :  function(bal){
        this.$store.dispatch('updateCZXPBalance', bal)
      },
      setCryptozBalance : function(tokens) {
        //console.log('setCryptozBalance:',bal);
        //this.cards_owned = parseInt(bal).toLocaleString();
        this.$store.dispatch('updateCardsOwned', tokens.length)
      },
      setBoostersOwned : function(_total){
        //console.log('setBoostersOwned:',_total);
        //this.boosters_owned = parseInt(_total).toLocaleString();
        this.$store.dispatch('updateBoostersOwned', parseInt(_total).toLocaleString())
      },
    }
  }
  
</script>
<style scoped>


</style>