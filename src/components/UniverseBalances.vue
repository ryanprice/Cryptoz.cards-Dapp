<template>
  
  <b-row>
    <b-col cols="5" class="text-left">
      <p><img class="czxp-logo" src="@/assets/czxp.png" /> <strong>{{totalCzxpSupply}} CZXP tokens</strong> in the Universe</p>
    </b-col>
    <b-col class="text-center">
      <p><strong>{{totalCryptozTypes}} Cryptoz Types</strong> in the Universe</p>
    </b-col>
    <b-col class="text-right">
      <p><strong>{{totalCryptozSupply}} Cryptoz Cards</strong> in the Universe</p>
    </b-col>
  </b-row>
  
</template>
<script>
  import {UniverseBalances} from 'vuex'
  
  export default {
    name: 'UniverseBalances',
    computed: {
      universeBalances() {
        return this.$store.state.universeBalances;
      },
      totalCzxpSupply(){
        return this.$store.state.totalCzxpSupply;
      },
      totalCryptozSupply(){
        return this.$store.state.totalCryptozSupply;
      },
      totalCryptozTypes(){
        return this.$store.state.totalCryptozTypes;
      },
      coinbase() {
        return this.$store.state.web3.coinbase;
      },
    },
    data() {
      return {}
    },
    mounted() {
      this.setSubscriptions()
    },
    watch: {
      universeBalances(newValue, oldValue) {
        console.log(`Updating universeBalances from ${oldValue} to ${newValue}`);
  
        // new balances.. reset Universe totals
        if (newValue !== oldValue) {
          this.setSubscriptions();
        }
      },
    },
    methods : {
      setSubscriptions : function() {
        console.log("Set the Universe balances...");

        Cryptoz.deployed().then(function(instance) {
          return instance.getTotalTypes.call();
        }).then(this.handleTotalTypes)
        
        CzxpToken.deployed().then(function(instance) {
          return instance.totalSupply.call();
        }).then(this.handleSetCZXPSupply) //update boosters owned and total types
        
        Cryptoz.deployed().then(function(instance) {
          return instance.totalSupply.call();
        }).then(this.handleSetCryptozSupply)
        
      },
      handleTotalTypes: function(_total){
        this.$store.dispatch('updateTypesTotal', parseInt(_total).toLocaleString())
      },
      // DONT DELETE !! THESE ARE SUPPLY TOTALS
      handleSetCZXPSupply :  function(_totalSupply) {
        this.$store.dispatch('updateCZXPTotal', parseInt(_totalSupply).toLocaleString())
      },
      handleSetCryptozSupply :  function(_totalSupply) {
        this.$store.dispatch('updateCryptozTotal', parseInt(_totalSupply).toLocaleString())
      },
    }
  }
</script>
<style scoped>
  .czxp-logo {
    width : 9%;
  }
</style>