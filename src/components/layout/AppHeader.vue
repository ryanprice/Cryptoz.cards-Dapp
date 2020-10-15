<template>
  <div id="app-header" class="headerComponent" >
    <b-navbar toggleable="lg" class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    <router-link id="cryptoz-logo" class="navbar-brand" to="/">
      <img class="logo-nav" src="./../assets/cryptokeeper_logo.svg" />
      Cryptoz
    </router-link>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item>
          <router-link to="/shop">Shop</router-link>
        </b-nav-item>
        <b-nav-item>
          <router-link to="/crypt">Your Crypt</router-link>
        </b-nav-item>
        <b-nav-item>
          <router-link to="/market">Markets</router-link>
        </b-nav-item>
        <b-nav-item>
          <router-link to="/view/1">View</router-link>
        </b-nav-item>
      </b-navbar-nav>
  
      <div class="bonusClass" v-if="coinbase != null && bonusReady == 1  && showSpinner == false" v-on:click="GetBonus">
        Claim 2 FREE Boosters !
      </div>
      <div v-else-if="showSpinner == true">
          <img src="@/assets/spinner.gif" class="spinner" />
          <transition>
            <span class="spinner-text-style">{{transactionMessage}}</span>
          </transition>
      </div>
      <div class="bonusClassNo" v-else-if="coinbase != null && bonusReady == 0 && showSpinner == false">
        Your Next Bonus:<br><strong> {{timeToBonus}}</strong>
      </div>

      <transition name="fade" mode="out-in">

        <p class="mm-header ml-auto" v-if="web3.isInjected == false">
          Metamask is <strong>required</strong> to connect Cryptoz on Ethereum
          <a href="https://metamask.io/" target="_blank">
            <img src="@/assets/metamask_logo.png" width="40%" />
          </a>
        </p>
        
        <span class="wallet-nav ml-auto flex-row" v-else>
          <div v-b-tooltip.hover :title="coinbase">
            <img src="@/assets/metamask-face.png" />
            {{coinbase.substr(0,6) + '...' + coinbase.substr(38)}}
          </div>
          <span v-b-tooltip.hover :title="wallet" class="wallet-balance">
            <img src="@/assets/ethereum-symbol.png" />
            {{wallet.toFixed(4)}}
          </span>
        </span>
      
      </transition>

      <b-nav  class="ml-auto">
        <router-link to="/help">Help</router-link>
      </b-nav>
    
      <b-nav-item v-if="web3.isInjected == false">
        <b-button variant="primary" v-on:click="requestPermission()">
          Connect
        </b-button>
      </b-nav-item>
      
    </b-collapse>
      
    </b-navbar>
      <p></p>
      
      </div>
</template>

<script>
import {mapState} from 'vuex'
import getPermission from '../../util/getPermission'

export default {
  name: 'AppHeader',
  computed: mapState({
    isInjected: state => state.web3.isInjected,
    network: state => NETWORKS[state.web3.networkId],
  }),
  beforeCreate () { //Initialize the app
    // console.log('registerWeb3 Action dispatched from AppHeader.vue')
    // this.$store.dispatch('registerWeb3')
  },
  computed: {
    web3 () {
      return this.$store.state.web3
    },
    wallet () {
      return parseFloat(web3.fromWei(this.$store.state.web3.balance), 'ether');
    },
    balance(){
      return this.$store.state.web3.balance;
    },
    coinbase() {
      return this.$store.state.web3.coinbase;
    },
    currentEvent() {
      return this.$store.state.lastChainEvent;
    }
  },
  data () {
    return {
      pendingTransaction:0,
      showSpinner:false,
      transactionMessage: 'Pending confirmation...',
      showLogin : 1,
      bonusReady : 2,
      timeToBonus : 0,
    }
  },
  watch: {
    coinbase(newValue, oldValue) {
      console.log(`Updating coinbase in header from ${oldValue} to ${newValue}`);
      // new wallet.. check their bonus and tell Owner balances to update
      if (newValue !== oldValue) {
        this.$store.dispatch('updateOwnerBalances')
        this.$store.dispatch('updateUniverseBalances')
        this.setSubscriptions();
      }
    },
    currentEvent(newValue,oldValue) {
      console.log('HEADER currentEvent:',newValue)
      if(newValue !== oldValue && typeof newValue !== "undefined"){
        if (this.pendingTransaction == newValue.blockHash) {
          this.showSpinner = false;
          this.transactionMessage = 'Confirmed! Balance updated';
          this.setSubscriptions();
        }
      }
    }
  },
  mounted () {
    //first check if the dapp is authed and logged in
    //console.log('AppHeader mounted...')
    //this.setSubscriptions(); TOO EARLY FOR THIS :(
  },
  methods : {
    setSubscriptions : function() {
      //Lets do a check for the Daily bonus'
      console.log('Check if the bonus is available for this playa..');
      //console.log(this.coinbase);
      //console.log(this.balance);
      
      var self = this
      
      Cryptoz.deployed().then(function(instance) {
        return instance.getTimeToDailyBonus(self.coinbase);
      }).then(function(res) {
        //console.log('Time to next bonus is:');
        //console.log(res.c[0]*1000);
        var timeToBonusInMilli = res.c[0]*1000;
        var now = new Date();
        //console.log('now is ' + now.getTime());
        
        if(now.getTime() >= timeToBonusInMilli){
          self.bonusReady = 1; //Claim bonus state
        }else{
          self.bonusReady = 0; //countdown to bonus state
          self.timeToBonus = self.GetTimeString(res.c[0]*1000);
        }
      })
      
    },
    requestPermission : async function() {
      console.log('Connect to metamask button clicked');
      
      await ethereum.enable();
      
      // Acccounts now exposed
      console.log('!!!!! WE ARE IN..from Header button');
      
      this.$store.dispatch('registerWeb3')
      
      
    },
    GetBonus : function() {
      console.log('GetBonus called...');
      
      //change state to pending
      this.showSpinner = true;
      this.transactionMessage = 'Pending confirmation...';
      
      var self = this;
      Cryptoz.deployed().then(function(instance) {
        return instance.getBonusBoosters({from: self.coinbase, gas:362000});
      }).then(function(result) {
        //change from pending to ready
        self.pendingTransaction = result.receipt.blockHash;
        self.transactionMessage = 'Broadcast to chain...';
      }).catch(function (e) {
        // Transaction rejected or failed
            //reset the claim tokens message
            self.showSpinner = false;
            self.transactionMessage = 'Claim 2 FREE Boosters !';
      });
    },
    GetTimeString: function(_timeStamp) {
      
        var t     = new Date(_timeStamp),
        hours     = t.getHours(),
        min       = t.getMinutes() + '',
        pm        = false,
        months    = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      if(hours > 11){
        hours = hours - 12;
        pm = true;
      }

      if(hours == 0) hours = 12;
      if(min.length == 1) min = '0' + min;

      //return months[t.getMonth()] + ' ' + t.getDate() + ', ' + t.getFullYear() + ' ' + hours + ':' + min + ' ' + (pm ? 'pm' : 'am');
      return months[t.getMonth()] + ' ' + t.getDate() + ' at ' + hours + ':' + min + ' ' + (pm ? 'pm' : 'am');
    },
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #cryptoz-logo {
    margin-right: 3rem;
  }

  .router-link-active {
    color:#ffffff;
  }
  
  .mm-header {
    color: #fff;
    text-align: right;
    margin-right: 10px;
    width: 23em;
  }

  .logo-nav{
    margin-right: 0.5em;
    width:2em;
  }

  .wallet-nav{
    color: #d48b15;
    width:22em;
    margin-left: 2em;
  }

  .wallet-nav img {
    width: 30px;
  }
  
  li{
    margin-right: 1.2em;
  }
  
  a{
    padding: 2px;
  }

  a:hover{
    color:#FFF;
    text-decoration: none;
    transform: scale(1.1);
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .bonusClass:hover{
    color:#00FF00;
    margin-right: 0.8em;
    cursor: pointer;
    padding:1px;
    border: 1px solid #fff;
    animation: none;
  }
  
  .bonusClassNo{
    color:#f7162c;
  }
  
  .bonusClassLogIn{
    color:#ffff00;
    margin-right: 3.2em;
  }
  .wallet-balance{
    color:lightgreen;
    margin: 0 4em 0 1em;
  }
  
  .bonusClass {
    animation: shake 3.82s infinite cubic-bezier(.36,.07,.19,.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
    color:#00FF00;
    margin-right: 0.8em;
    cursor: pointer;
    padding:1px;
    border: 1px solid transparent;
  }

  .flex-row {
    display: flex;
    flex-direction: row;
  }

  @keyframes shake {
    10%, 90% {
      transform: translate3d(-1px, 0, 0);
    }
    
    20%, 80% {
      transform: translate3d(2px, 0, 0);
    }
  
    30%, 50%, 70% {
      transform: translate3d(-4px, 0, 0);
    }
  
    40%, 60% {
      transform: translate3d(4px, 0, 0);
    }
  }
  .spinner {
    width: 2em;
  }
  .spinner-text-style{
    color: #fff;
  }
</style>