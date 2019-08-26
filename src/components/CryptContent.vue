<template>
  <div>
    
    <!-- Open Booster Modal -->
    <b-modal id="open-booster-modal">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Enter a CZXP wager amount to increase the odds of pulling a rare or epic card:</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        Minimum = 0 Or 2,000,000,000 , Maximum = 1,649,267,441,667,000
        <input id="wager" class="form-control" type="text" v-on:input="wagerAmount = $event.target.value" value="0" required />
      </div>
      <div class="modal-footer">
        <b-button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="confirmOpenBtnDisabled = 0">Cancel</b-button>
        <b-button type="button" class="btn btn-danger" :disabled="confirmOpenBtnDisabled == 1" v-on:click="openBooster">Open Booster</b-button>
      </div>
    </div>
  </div>
</b-modal>
    
    <div class="jumbotron">
          <h1>Your Cryptoz Wallet</h1>
          <p>This is where all your Cryptoz cards can be accessed. From here you can sort your cards, search your cards and sacrifice. Sacrificing is permanent. Not only in your wallet, but across the entire Cryptoz Universe. That unique item is gone forever.</p>
          
          <!-- Loads cards here -->
            <div class="row">
              <div class="col">
                <b-button class="btn btn-danger" v-bind:disabled="boosters_owned < 1" v-b-modal.open-booster-modal>Open Booster Card
                </b-button>
              </div>
              <div class="col">
                <button class="btn btn-danger" v-bind:disabled="buyOpenBtnOn == 0 || balance < 2000000000000000" v-on:click="buyAndOpenBooster">Buy and Open Booster 0.002E
                </button>
              </div>
                <div class="col"><strong>Your CZXP Balance :</strong> {{czxp_balance}}
                </div>
            </div>
            <br>
            <div class="row">
              <div class="col"><strong>Your Boosters :</strong> {{boosters_owned}}
              </div>
              <div class="col"><strong>Your Cryptoz:</strong> {{cards_owned}}
              </div>
              <div class="col text-right"  v-if="ownsCards == 1">
                <div class="dropdown">
                  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Sort By
                  </button>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" href="#" v-on:click="sortByName('name')">Name</a>
                    <a class="dropdown-item" href="#" v-on:click="sortByAttr('rarity')">Rarity</a>
                    <a class="dropdown-item" href="#" v-on:click="sortByAttr('cost')">Cost</a>
                    <a class="dropdown-item" href="#" v-on:click="sortByAttr('card_set')">Card Set</a>
                    <a class="dropdown-item" href="#" v-on:click="sortByAttr('edition_total')">Edition Total</a>
                    <a class="dropdown-item" href="#" v-on:click="sortByAttr('card_level')">Level</a>
                    <a class="dropdown-item" href="#" v-on:click="sortByAttr('unlock_czxp')">Unlock CZXP</a>
                    <a class="dropdown-item" href="#" v-on:click="sortByAttr('buy_czxp')">Buy CZXP</a>
                    <a class="dropdown-item" href="#" v-on:click="sortByAttr('transfer_czxp')">Transfer CZXP</a>
                    <a class="dropdown-item" href="#" v-on:click="sortByAttr('sacrifice_czxp')">Sacrifice CZXP</a>
                  </div>
                </div>
              </div>
            </div>
            <br>
            <div class="row" v-if="ownsCards == 1">
              <OwnedCardContent v-on:card-updated="handleCardUpdated"
                v-for="card in allCards" :key="card.id"
                :id="card.id"
                :type_id="card.attributes.type_id"
                :name="card.name"
                :cost="card.attributes.cost"
                :cset="card.attributes.card_set"
                :edition_total="card.attributes.edition_total"
                :level="card.attributes.card_level"
                :unlock_czxp="card.attributes.unlock_czxp"
                :buy_czxp="card.attributes.buy_czxp"
                :transfer_czxp="card.attributes.transfer_czxp"
                :sacrifice_czxp="card.attributes.sacrifice_czxp"
                :image="card.image"
                :card_class="card.attributes.rarity"
              ></OwnedCardContent>
            </div>
            <div v-else><h2>You do not own any Cryptoz<br><router-link to="/shop">To get Free Cryptoz or Buy one, visit the Shop</router-link></h2></div>
        </div>
  </div>
</template>

<script>
import axios from 'axios'
import OwnedCardContent from '@/components/OwnedCardContent.vue'

export default {
  name: 'CryptContent',
  components : {
    OwnedCardContent
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
    
  },
  watch: {
    coinbase(newValue, oldValue) {
      console.log(`Updating from ${oldValue} to ${newValue}`);

      // new wallet.. reset their boosters and czxp balance
      if (newValue !== oldValue) {
        this.setSubscriptions();
      }
    },
  },
  mounted () {
    this.setSubscriptions();
  },
  data () {
    return {
      czxp_balance : 'Log in Metamask',
      ownsCards : 0,
      cards_owned : 'Log in Metamask',
      boosters_owned : 'Log in Metamask',
      el : 0,
      buyOpenBtnOn : 0,
      confirmOpenBtnDisabled : 0,
      wagerAmount : 0,
      allCards: []
    }
  },
  methods : {
    handleCardUpdated : function() {
      console.log('CryptContent got child event..re-render the view');
      this.setSubscriptions();
    },
    setSubscriptions : function() {
      var self = this;
      
      CzxpToken.deployed().then(function(instance) {
        return instance.balanceOf(self.coinbase);
      }).then(this.setCzxpBalance)
      
      Cryptoz.deployed().then(function(instance) {
        console.log("get cryptoz cards tokens balance...");
        return instance.balanceOf(self.coinbase);
      }).then(this.setCryptozBalance)
      
      Cryptoz.deployed().then(function(instance) {
        return instance.boosterPacksOwned(self.coinbase);
      }).then(this.setBoostersOwned)
      
      Cryptoz.deployed().then(function(instance) {
        return instance.tokensOfOwner(self.coinbase)
      }).then(this.handleGetAllCards)
      
      this.buyOpenBtnOn = 1;
    },
    buyAndOpenBooster : function() {
      console.log('Buy and Open Booster card...');
      var self = this;
      Cryptoz.deployed().then(function(instance) {
        return instance.buyBoosterCardAndOpen({from: self.coinbase, value:2000000000000000});
      //}).then(this.handleBuyBooster)
      }).then(this.handleBuyBooster) //update boosters owned and total types
      
    },
    handleGetAllCards : function(res) {
      console.log('Handling tokensOfOwner...');
      console.log(res);
      
      //reset the view to empty
      this.allCards = []
      
      if(res.length > 0){
        console.log('Got cards.. start render');
        var self= this;
        //first we update the view
        this.ownsCards = 1;
        
        
        //Place to track our token array data
        var tokenIdList = [];

        //Define a function to do all our handling and chain the data before passing back to our view
        var getCard = function(tokenId){

          Cryptoz.deployed().then(function(instance) {
            return instance.getOwnedCard.call(tokenId)
          }).then(function(elementReturned) {
            console.log('A card !' + tokenId);
            console.log(elementReturned);
            tokenIdList[tokenId] = elementReturned
            return axios.get('https://cryptoz.cards/services/getCardData.php?card_id=' + elementReturned[0].c[0])
          }).then(function(res){
            //console.log('token id:' + tokenId);
            //console.log('edition:' + tokenIdList[tokenId][1].c[0])
            console.log(res)
            
            //card token id
            res.data.id = tokenId;
            
            var newAttr = [];
            //format the attributes to match our JS objects
            res.data.attributes.forEach(function(element){
              newAttr[element.trait_type] = element.value;
            })
            
            //Overwrite our JSON reponse with vue friendly card binding data
            res.data.attributes = newAttr;
            
            //Edition total
            // #4  , #4 of 300
            if(res.data.attributes.edition_total == 0) //unlimited
            {
              res.data.attributes.edition_total = '#'+tokenIdList[tokenId][1].c[0];
            }else{
              res.data.attributes.edition_total = '#'+tokenIdList[tokenId][1].c[0] +' of '+res.data.attributes.edition_total;
            }
            
            //pass the card data array to our view update handler
            self.handleGotCardData(res);
          })
        }
        
        //Iterate through all our cards
        res.forEach(function(element){
          //console.log(element.c[0]);
          //tokenIdList.push(element.c[0]);
          getCard(element.c[0])
        })
        
        
      }else{
        console.log('no cards returned from handleGetAllCards()');
        this.ownsCards = 0; //set the message to buy or get Cryptoz
      }
    },
    getCurrentValue : function() {
      return this.el;
    },
    handleGotCardData : function(res) {
      //console.log(res.data);
      //Append the bg
      switch(res.data.attributes.rarity){
        case "Common":
          res.data.attributes.rarity = 'card-bg card-bg-6';
          break;
        case "Uncommon":
          res.data.attributes.rarity = 'card-bg card-bg-5';
          break;
        case "Rare":
          res.data.attributes.rarity = 'card-bg card-bg-4';
          break;
        case "Epic":
          res.data.attributes.rarity = 'card-bg card-bg-3';
          break;
        case "Diamond":
          res.data.attributes.rarity = 'card-bg card-bg-2';
          break;
        case "Platinum":
          res.data.attributes.rarity = 'card-bg card-bg-1';
          break;
      }
      
      this.allCards.push(res.data);
    },
    handleBuyBooster : function(result) {
      console.log('Handling buy booster...');
      console.log(result);
      this.$bvModal.hide('open-booster-modal')
      this.setSubscriptions();
    },
    openBooster : function () {
      
      console.log('Wagering..' + this.wagerAmount);
      
      var self = this;
      
      this.confirmOpenBtnDisabled = 1;
      
      Cryptoz.deployed().then(function(instance) {
        return instance.openBoosterCard(self.wagerAmount, {from: self.coinbase});
      }).then(this.setSubscriptions)
    },
    setCzxpBalance :  function(bal){
      //console.log(bal.toString());
      this.czxp_balance = parseInt(bal).toLocaleString();
    },
    setCryptozBalance : function(bal) {
      //console.log(bal.toString());
      this.cards_owned = parseInt(bal).toLocaleString();
    },
    setBoostersOwned : function(_total){
      console.log('Updating Boosters owned...');
      //console.log(_total);
      this.boosters_owned = parseInt(_total).toLocaleString();
    },
    sortByName : function(param) {
      this.allCards.sort(dynamicSort(param))
    },
    sortByAttr : function(param) {
      this.allCards.sort(sortAttributes(param))
    }
  }
}

/*
  Ok we need to track the state of the Crypt
  LoggedIn 1 or 0
  ownsCards 1 or 0
  Sorted By
    Name
    Date Type loaded
    Limited Edition
*/

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .jumbotron {
    margin: auto;
    width: 95%;
  }
</style>