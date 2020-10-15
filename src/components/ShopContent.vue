<template>
  <div>
    
  <b-modal
    id="buy-boosters-modal"
    title="Buy Booster Credits @ 0.002E each"
    hide-footer
    >
        <h5 class="modal-title">Booster cards will never be sold in the shop</h5>
        Enter the number of booster credits you would like to purchase:
      <b-row>
          <b-col cols="4">
            <input id="toWallet" class="form-control" type="text" v-on:input="totalCreditsToBuy = $event.target.value" value="1" required />
          </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button class="mt-3" variant="danger" block @click="buyBoosters">Buy Credits
          </b-button>
        </b-col>
        <b-col>
          <b-button class="mt-3" variant="secondary" block @click="$bvModal.hide('buy-boosters-modal')">Cancel
          </b-button>
        </b-col>
      </b-row>
  </b-modal>
    
    
    <!--main role="main" class="container"-->
      <div class="jumbotron">
        <p>
          
        <UniverseBalances></UniverseBalances>
        </p>
          <h1>Shop</h1>
          <p>The Shop is a place to mint limited edition Cryptoz Cards. Some cards are free, some have a cost. You may also buy and open a booster card, which will randomly mint an unlimited edition card</p>
          <p>
            To Claim a FREE card Or buy a Limited edition card, you will need the required minimum balance of CZXP tokens
          </p>
          <div class="row">
            <div class="col">
              <!--button class="btn btn-danger" v-bind:disabled="buyBoostBtnOn == 0" data-toggle="modal" data-target="#buyBoostersPanel">Buy Booster Credits @ 0.002E
              </button-->
              <b-button class="btn btn-danger" v-bind:disabled="buyBoostBtnOn == 0 || balance < 2000000000000000" v-b-modal.buy-boosters-modal>Buy Booster Credits @ 0.002E</b-button>
              <transition name="fade">
                <span v-if="showSpinner==1">
                  <img src="@/assets/spinner.gif" class="spinner" /> <strong>{{transactionStatus}}</strong>
                </span>
              </transition>
            </div>
          </div>
          <br>
          
          <OwnerBalances></OwnerBalances>
          
          <br>
          <div class="row">
              <div class="col text-left">
                <b-dropdown id="dropdown" text="Sort By">
                    <b-dropdown-item @click="sortByName('name')">Name</b-dropdown-item>
                    <b-dropdown-item @click="sortByAttr('rarity')">Rarity</b-dropdown-item>
                    <b-dropdown-item @click="sortByAttr('cost')">Cost</b-dropdown-item>
                    <b-dropdown-item @click="sortByAttr('card_set')">Card Set</b-dropdown-item>
                    <b-dropdown-item @click="sortByAttr('edition_total')">Edition Total</b-dropdown-item>
                    <b-dropdown-item @click="sortByAttr('card_level')">Level</b-dropdown-item>
                    <b-dropdown-item @click="sortByAttr('unlock_czxp')">Unlock CZXP</b-dropdown-item>
                    <b-dropdown-item @click="sortByAttr('buy_czxp')">Buy CZXP</b-dropdown-item>
                    <b-dropdown-item @click="sortByAttr('transfer_czxp')">Transfer CZXP</b-dropdown-item>
                    <b-dropdown-item @click="sortByAttr('sacrifice_czxp')">Sacrifice CZXP</b-dropdown-item>
                </b-dropdown>
              </div>
            </div>
          <br>
          <div class="row">
              <OwnedCardContent
                v-for="card in storeCards" :key="card.attributes.type_id"
                :type_id="card.attributes.type_id"
                :name="card.name"
                :cost="card.attributes.cost"
                :cset="card.attributes.card_set"
                :edition_total="card.attributes.edition_total"
                :in_store="card.attributes.in_store"
                :level="card.attributes.card_level"
                :unlock_czxp="card.attributes.unlock_czxp"
                :buy_czxp="card.attributes.buy_czxp"
                :transfer_czxp="card.attributes.transfer_czxp"
                :sacrifice_czxp="card.attributes.sacrifice_czxp"
                :image="card.image"
                :card_class="card.attributes.rarity"
              ></OwnedCardContent>
          </div>


        
      </div>
    <!--/main-->
  </div>
</template>

<script>
import OwnedCardContent from '@/components/OwnedCardContent.vue'
import UniverseBalances from '@/components/UniverseBalances.vue'
import OwnerBalances from '@/components/OwnerBalances.vue'

export default {
  name: 'ShopContent',
  components : {
    OwnedCardContent,
    UniverseBalances,
    OwnerBalances
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
    totalCyptozTypes() {
      return this.$store.state.totalCryptozTypes;
    },
    currentEvent() {
      return this.$store.state.lastChainEvent;
    }
  },
  watch: {
    balance(newValue, oldValue) {
      //console.log(`Updating balance from ${oldValue} to ${newValue}`);

      // new wallet.. reset their boosters and czxp balance
      if (newValue >= 2000000000000000) {
        this.buyBoostBtnOn = 1;
      }
    },
    totalCyptozTypes(newValue, oldValue) {
      if (newValue !== oldValue && newValue > 0) {
          this.getAllTypes();
      }
    },
    currentEvent(newValue,oldValue) {
      console.log('SHOP currentEvent:',newValue)
      if(newValue !== oldValue && typeof newValue !== "undefined"){
        if (this.pendingTransaction == newValue.blockHash) {
          this.showSpinner = 0;
          this.transactionStatus = 'Confirmed! Balance updated';
        }
      }
    }
  },
  data () {
    return {
      pendingTransaction:0,
      showSpinner:0,
      transactionStatus: 'Pending confirmation...',
      showUnlimited : 1,
      transaction_number : '',
      storeCards: [],
      buyBoostBtnOn: 0,
      confirmBoosterBuyBtnDisabled: 0,
      totalCreditsToBuy : 1,
      allCards : [] //We never mangle this
    }
  },
  mounted () {
    console.log('The shop is mounted, call for the cards, if we have a contract..');
    
    if(typeof Cryptoz  !== "undefined"){
      this.getAllTypes();
    }else{
      console.log('Cryptoz contract not defined !!!!!!!!!!');
    }
      
  },
  methods : {
    buyBoosters : function() {
      console.log('Buy boosters called..');
      
      //Hide the modal
      this.$bvModal.hide('buy-boosters-modal')
      
      //Change buy button to pending.. or show some pending state
      this.showSpinner = 1;
      this.transactionStatus = 'Pending confirmation...';
      
      //pass to metamask
      var self = this;
      
      try{
        Cryptoz.deployed().then(function(instance) {
          var totalBoostersCost = 2000000000000000 * parseInt(self.totalCreditsToBuy);
          return instance.buyBoosterCard(parseInt(self.totalCreditsToBuy), {from: self.coinbase, value:totalBoostersCost});
        }).then(this.handleBuyBooster) //update boosters owned and total types
        
      }catch(error) {
        console.error('buyBoosters cancelled/failed:', error);
      }
      
    },
    handleBuyBooster : function(error,result) {
        console.log('Handling buy booster', error, result);
        if(error)
        {
          console.log('USER REJECTED!!');
          this.showSpinner = 0;
        }
        //change from pending to ready
        this.pendingTransaction = result.receipt.blockHash;
        this.transactionStatus = 'Broadcast to chain...';
    },
    getAllTypes: function(){
      //Lets get all the cards now
      console.log('Get all the cards...')
      var self = this;
      
      //reset the view
      this.storeCards = [];

      for (var i = 1; i < this.totalCyptozTypes; i++) {
        fetch('https://cryptoz.cards/services/getCardData.php?card_id=' + i)
        .then(this.handleGotCardData)
        .catch(function(err){
          console.log('FETCH error:',err);
        })
      }
    },
    handleGotCardData : function(response) {
      var self = this;
      
      if (response.status !== 200) {
        console.log('Looks like there was a problem from FETCH. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then(function(res) {
        
        //console.log('gotCardData:', res.attributes);
        
        if(res.attributes[3].value != 'Store'){
          return;
        }
        
        var newAttr = [];
        //format the attributes to match our JS objects
        res.attributes.forEach(function(element){
          newAttr[element.trait_type] = element.value;
        })
              
        //Overwrite our JSON reponse with vue friendly card binding data
        res.attributes = newAttr;
        
        //Append the bg
        switch(res.attributes.rarity){
          case "Common":
            res.attributes.rarity = 'card-bg card-bg-6';
            break;
          case "Uncommon":
            res.attributes.rarity = 'card-bg card-bg-5';
            break;
          case "Rare":
            res.attributes.rarity = 'card-bg card-bg-4';
            break;
          case "Epic":
            res.attributes.rarity = 'card-bg card-bg-3';
            break;
          case "Diamond":
            res.attributes.rarity = 'card-bg card-bg-2';
            break;
          case "Platinum":
            res.attributes.rarity = 'card-bg card-bg-1';
            break;
        }
        
        if(res.attributes.edition_total === 0){
          res.attributes.edition_total = "Unlimited"
        }
        self.allCards.push(res);
        self.storeCards.push(res);
        
      });

    },
    sortByName : function(param) {
      this.storeCards.sort(dynamicSort(param))
    },
    sortByAttr : function(param) {
      this.storeCards.sort(sortAttributes(param))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .jumbotron {
    margin: auto;
    width: 95%;
  }
  .spinner {
    width: 2em;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .10s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>