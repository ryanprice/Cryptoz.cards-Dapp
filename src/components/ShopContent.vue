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
                    <b-dropdown-item @click="sortByAttr('name', false)">Name</b-dropdown-item>
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
            <div v-for="card in storeCards" :key="card.type_id">
              <OwnedCardContent
                :type_id="card.type_id"
                :name="card.name"
                :cost="card.cost"
                :cset="card.card_set"
                :edition_total="card.edition_total"
                :in_store="card.in_store"
                :level="card.card_level"
                :unlock_czxp="card.unlock_czxp"
                :buy_czxp="card.buy_czxp"
                :transfer_czxp="card.transfer_czxp"
                :sacrifice_czxp="card.sacrifice_czxp"
                :image="card.image"
                :card_class="card.rarity"
              ></OwnedCardContent>
              <div id="buy-get-button-wrapper">
                <div v-if="card.cost > 0" id="buyBtnwrapper" v-b-tooltip="buyBtnTooltipText">
                  <button id="buy-button" :disabled="wallet <= card.cost || card.czxpBalance < parseInt(card.unlock_czxp)" class="btn btn-danger" v-on:click="buyCard(card)">
                    Buy Card {{card.cost}}E <b-icon-lock-fill v-if="wallet <= card.cost || card.czxpBalance < parseInt(card.unlock_czxp)"></b-icon-lock-fill>
                  </button>
                </div>
                <div v-else id="getBtnwrapper" v-b-tooltip.hover="getBtnTooltipText">
                  <button id="get-button"  class="btn btn-danger" :disabled="card.czxpBalance < parseInt(card.unlock_czxp)" v-on:click="getCard(card)">
                    Get Card <b-icon-lock-fill v-if="card.czxpBalance < parseInt(card.unlock_czxp)"></b-icon-lock-fill>
                  </button>
                </div>
              </div>
            </div>
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
    },
    buyBtnTooltipText() {
      if (this.wallet <= this.cost || this.czxpBalance < parseInt(this.unlock_czxp)) {
        return this.buyBtnBlockedTooltipTextContent
      } else {
        return this.buyBtnTooltipTextContent
      }
    },
    getBtnTooltipText() {
      if (this.czxpBalance < parseInt(this.unlock_czxp)) {
        return this.getBtnBlockedTooltipTextContent
      } else {
        return this.getBtnTooltipTextContent
      }
    },
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
          this.transactionStatus = 'Confirmed ! balance updated';
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
      allCards : {}, //We never mangle this
      buyBtnTooltipTextContent: 'Click to buy a copy of this card',
      buyBtnBlockedTooltipTextContent:'You do not have enough Ether or CZXP tokens to purchase this card',
      getBtnTooltipTextContent: 'Click to get a copy of this card at no cost',
      getBtnBlockedTooltipTextContent: 'You do not have enough CZXP tokens to unlock this button and claim this Free card'
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
    buyCard : function(cardAttributes){
      console.log("Buying card:" + cardAttributes.type_id);
      
      window.Cryptoz.deployed().then((instance) => {
        return instance.buyCard(cardAttributes.type_id, {from: this.coinbase, value:(cardAttributes.cost*1000000000000000000)});
      }).then((res) => {
        console.log(res);
        this.showTransaction =1
        this.$store.dispatch('updateOwnerBalances')
      })
    },
    getCard : function(cardAttributes){
      console.log("Claiming card:" + cardAttributes.type_id);
      
      window.Cryptoz.deployed().then((instance) => {
        return instance.getFreeCard(cardAttributes.type_id, {from: this.coinbase});
      }).then((res) => {
        console.log(res)
        this.showTransaction =1
        this.$store.dispatch('updateOwnerBalances')
      })
    },
    buyBoosters : function() {
      console.log('Buy boosters called..');
      
      //Hide the modal
      this.$bvModal.hide('buy-boosters-modal')
      
      //Change buy button to pending.. or show some pending state
      this.showSpinner = 1;
      this.transactionStatus = 'Pending confirmation...';
      
      //pass to metamask
      try{
        Cryptoz.deployed().then((instance) => {
          var totalBoostersCost = 2000000000000000 * parseInt(this.totalCreditsToBuy);
          return instance.buyBoosterCard(parseInt(this.totalCreditsToBuy), {from: this.coinbase, value:totalBoostersCost});
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
      if (response.status !== 200) {
        console.log('Looks like there was a problem from FETCH. Status Code: ' +
          response.status);
        return;
      }

      // Examine the text in the response
      response.json().then((res) => {
        if(res.attributes[3].value !== 'Store'){
          return;
        }
        
        var newAttr = {};
        //format the attributes to match our JS objects
        res.attributes.forEach(function(element){
          newAttr[element.trait_type] = element.value;
        })
              
        //Overwrite our JSON reponse with vue friendly card binding data
        res.attributes = newAttr;
        
        //Append the bg
        switch(res.attributes.rarity){
          case "Common":
            newAttr.rarity = 'card-bg card-bg-6';
            break;
          case "Uncommon":
            newAttr.rarity = 'card-bg card-bg-5';
            break;
          case "Rare":
            newAttr.rarity = 'card-bg card-bg-4';
            break;
          case "Epic":
            newAttr.rarity = 'card-bg card-bg-3';
            break;
          case "Diamond":
            newAttr.rarity = 'card-bg card-bg-2';
            break;
          case "Platinum":
            newAttr.rarity = 'card-bg card-bg-1';
            break;
        }
        
        if(res.attributes.edition_total === 0){
          newAttr.edition_total = "Unlimited"
        }
        delete res.attributes //already handled these
        for (let attr in res) {
          newAttr[attr] = res[attr]
        }
        this.allCards[newAttr.type_id] = newAttr;
        this.storeCards.push(newAttr);
      });

    },
    sortByAttr: function(param, descending = true) {
      this.storeCards.sort(dynamicSort(param, descending))
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
  #buy-get-button-wrapper{
    position: relative;
    text-align: center;
    height: 45px;
  }
  /* add a little arrow for users to be sure which they're purchasing */
  #buy-get-button-wrapper::before {
    content: '';
    position: absolute;
    top:-10px;
    transform: translateX(-50%);
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #dc3545;
  }
</style>