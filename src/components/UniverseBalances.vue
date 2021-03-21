<template>
  <div class="row-col">
    <p>
      <strong>{{totalCzxpSupply}} CZXP
        {{' '}}<img class="czxp-logo" src="./assets/cryptokeeper_coin_binance.svg" />tokens
      </strong>
      {{' '}}in the Universe
    </p>
    <p><strong>{{totalCryptozTypes}} Mintable types</strong> in shop and boosters</p>
    <p><strong>{{totalCryptozSupply}} NFTs </strong> in the Universe</p>
  </div>
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
        // console.log(`Updating universeBalances from ${oldValue} to ${newValue}`);
  
        // new balances.. reset Universe totals
        if (newValue !== oldValue) {
          this.setSubscriptions();
        }
      },
    },
    methods : {
      setSubscriptions : function() {
        // console.log("Set the Universe balances...");

        window.Cryptoz.deployed().then(function(instance) {
          return instance.getTotalTypes.call();
        }).then(this.handleTotalTypes)
        
        window.CzxpToken.deployed().then(function(instance) {
          return instance.totalSupply.call();
        }).then(this.handleSetCZXPSupply) //update boosters owned and total types
        
        window.Cryptoz.deployed().then(function(instance) {
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
  p {
    padding-left: 10px;
    margin-bottom: 0;
  }

  .czxp-logo {
    width : 20px;
    margin-right: 2px;
  }

  .row-col {
    display: flex;
    flex-direction: column;
    
    margin: 20px 0;
  }

  @media screen and (min-width: 600px) {
    .row-col {
      flex-direction: row;
      justify-content: space-between;
    }
  }
</style>