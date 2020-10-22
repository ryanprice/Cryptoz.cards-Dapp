<template>
  <div>
    
  <!-- Open Booster Modal -->
  <b-modal
    id="open-booster-modal"
    title="Enter a CZXP wager amount to increase the odds of pulling a rare or epic card:"
    ok-variant="danger"
    ok-title="Open Booster"
    hide-footer
  >
      
        Minimum = 0 Or 2,000,000,000 , Maximum = 1,649,267,441,667,000
        <input id="wager" class="form-control" type="text" v-on:input="wagerAmount = $event.target.value" value="0" required />
    <b-row>
      <b-col>
        <b-button class="mt-3" variant="danger" block @click="openBooster">Open Booster</b-button>
      </b-col>
      <b-col>
        <b-button class="mt-3" block @click="$bvModal.hide('open-booster-modal')">Cancel</b-button>
      </b-col>
    </b-row>
  </b-modal>
    
    <div class="jumbotron">
      <UniverseBalances></UniverseBalances>
      
          <h1>Your Cryptoz Wallet</h1>
          <p>This is where all your Cryptoz cards can be accessed. From here you can sort your cards, search your cards and sacrifice. Sacrificing is permanent. Not only in your wallet, but across the entire Cryptoz Universe. That unique item is gone forever.</p>
          
          <!-- Loads cards here -->
            <div class="row">
              <div class="col">
                <b-button class="btn btn-danger" v-bind:disabled="boostersOwned < 1" v-b-modal.open-booster-modal>Open Booster Card
                </b-button>
              </div>
              <div class="col buy-and-open-booster">
                <button class="btn btn-danger" v-bind:disabled="web3.balance < 2000000000000000" v-on:click="buyAndOpenBooster">Buy and Open Booster 0.002E
                </button>
              </div>
            </div>
            <br>
            
            <OwnerBalances></OwnerBalances>
            
            <br>
            
            <div class="row">
              <div class="col text-left"  v-if="ownsCards">
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
            <div class="row" v-if="ownsCards">
              <OwnedCardContent v-on:card-updated="handleCardUpdated"
                v-for="card in orderedCards" :key="card.id"
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
import UniverseBalances from '@/components/UniverseBalances.vue'
import OwnerBalances from '@/components/OwnerBalances.vue'
import {showPendingToast, showSuccessToast, showRejectedToast, showErrorToast} from '../util/showToast';

export default {
  name: 'CryptContent',
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
      return parseFloat(window.web3.fromWei(this.$store.state.web3.balance), 'ether');
    },
    coinbase() {
      return this.$store.state.web3.coinbase;
    },
    boostersOwned() {
      return this.$store.state.boostersOwned;
    },
    currentEvent() {
      return this.$store.state.lastChainEvent;
    }
  },
  watch: {
    'web3': {
      handler(val, oldVal) {
        if (val.isConnected && val.coinbase) {
          this.getAllCards()
        }

        else {
          this.clearCards()
        }
      },
      deep: true
    },
    'currentEvent': {
      handler: function(newValue, oldValue) {
        if (newValue) {
          if(this.subscriptionState == 0){
            this.getAllCards();
          }
          if(oldValue && newValue.transactionHash !== oldValue.transactionHash){
            showSuccessToast(this, 'Confirmed! Balance updated')
          }
        }
      }
    }
  },
  mounted () {
    if(this.coinbase !== null){
      this.getAllCards();
    }
  },
  data () {
    return {
      subscriptionState:0, // 0=idle,1=active
      czxp_balance : 'Log in Metamask',
      ownsCards : false,
      el : 0,
      confirmOpenBtnDisabled : 0,
      wagerAmount : 0,
      orderedCards: []
    }
  },
  methods : {
    handleCardUpdated : function() {
      console.log('CryptContent got child event..re-render the view');
      this.getAllCards();
    },
    getAllCards : async function() {
      this.subscriptionState = 1;
      
      const instance = await window.Cryptoz.deployed();
      const tokensOfOwner = await instance.tokensOfOwner(this.coinbase);
      this.handleGetAllCards(tokensOfOwner)
    },
    clearCards: function() {
      this.orderedCards = []
    },
    buyAndOpenBooster : function() {
      console.log('Buy and Open Booster card...');
      showPendingToast(this);
      window.Cryptoz.deployed().then((instance) => {
        return instance.buyBoosterCardAndOpen({from: this.coinbase, value:2000000000000000});
      })
      //update boosters owned and total types
      .then(() => {
        this.$bvModal.hide('open-booster-modal')
        this.getAllCards()
      })
      .catch((err) => {
        console.log(err.message);
        if (err.code === 4001) {
         showRejectedToast(this);
        }
      })
    },
    handleGetAllCards : async function(res) {
      if(res.length > 0){
        var self= this;
        //first we update the view
        this.ownsCards = true;
        
        //Place to track our token array data
        var tokenIdList = {};

        //Define a function to do all our handling and chain the data before passing back to our view
        var getCard = function(tokenId){
          return new Promise((resolve, reject) => {
            window.Cryptoz.deployed().then(function(instance) {
              return instance.getOwnedCard(tokenId)
            }).then(function(elementReturned) {
              tokenIdList[tokenId] = elementReturned
              return axios.get('https://cryptoz.cards/services/getCardData.php?card_id=' + elementReturned[0].c[0])
            }).then(function(res){
              // console.log('edition:' + tokenIdList[tokenId][1].c[0])
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
              
              resolve(res.data)
            })
            .catch((err) => {
              reject(err)
            })
          })
        }
        
        //asynchronously get all our cards
        this.orderedCards = await Promise.all(
          res.map(element => getCard(element.c[0]))
        )
        this.$store.dispatch('updateCardsOwned', this.orderedCards.length)
        
      }else{
        console.log('no cards returned from handleGetAllCards()');
        this.ownsCards = false; //set the message to buy or get Cryptoz
      }
      //we are done, clear the state
      this.subscriptionState = 0;
    },
    handleBuyBooster : function(result) {
      console.log('Handling buy booster...');
      // console.log(result);
      
      //change from pending to ready
    },
    openBooster : function () {
      
      console.log('Wagering..' + this.wagerAmount);
      
      //Change buy button to pending.. or show some pending state
      showPendingToast(this);
      var self = this;
      
      this.$bvModal.hide('open-booster-modal')
      
      window.Cryptoz.deployed().then(function(instance) {
        return instance.openBoosterCard(self.wagerAmount, {from: self.coinbase});
      })
      .then(res => {
        if (res === undefined) {
          throw new Error('result is undefined in openBooster')
        }
      })
      .catch(err => {
        console.log(err);
        if (err.code === 4001) {
          showRejectedToast(self);
        }
      })
    },
    sortByName : function(param) {
      this.orderedCards.sort(dynamicSort(param))
    },
    sortByAttr : function(param) {
      this.orderedCards.sort(sortAttributes(param))
    }
  }
}

/*
  Ok we need to track the state of the Crypt
  LoggedIn true or false
  ownsCards true or false
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
  .spinner {
    width: 2em;
  }

  .spinner-wrapper {
    display: flex;
    margin: 0px 8px;
  }

  .buy-and-open-booster {
    display: flex;
  }
</style>