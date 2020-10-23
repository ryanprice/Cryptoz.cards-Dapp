<template>
  <div>

<!-- Transfer card Modal -->
<b-modal class="modal fade" :id="'transfer-modal-'+id">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLongTitle">Gift Cryptoz Card Token #{{id}} to another wallet</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        Enter a valid Ethereum wallet address to send this card to:
        <input id="toWallet" class="form-control" type="text" v-on:input="newWallet = $event.target.value" required />
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-danger" :disabled="confirmTransferBtnDisabled" v-on:click="transferCard">Confirm Transfer</button>
      </div>
    </div>
  </div>
</b-modal>
    
      <div class="col">
        <div class="flip-container" ontouchstart="this.classList.toggle('hover');">
	        <div class="flipper">
		        <div class="front">
			      <!-- front content -->
			        <div id="1" :class="card_class">
                <!--img class="card-img" :src="'static/assets/' + url" /-->
                <img class="card-img" :src="image" />
                <span class="card-edition">{{edition_total}}</span>
                <div class="card-item-name text-center">{{name}}<br>{{cset}}</div>
                <div class="card-czxp text-left">{{parseInt(unlock_czxp).toLocaleString()}}</div>
                <div class="card-level">{{level}}</div>
              </div>
            </div>
		        <div class="back">
              <!-- back content -->
              <div class="card-bg card-bg-back">
			          <div class="back-container">
			            <div class="card-txt-black"><span class="font-weight-bold">Cost:</span> {{cost}}</div>
			            <br>
			            <div class="card-txt-black"><span class="font-weight-bold">Buy CZXP:</span><br>{{parseInt(buy_czxp).toLocaleString()}}</div>
			            <div class="card-txt-black"><span class="font-weight-bold">Transfer CZXP:</span><br>{{parseInt(transfer_czxp).toLocaleString()}}</div>
			            <div class="card-txt-black"><span class="font-weight-bold">Sacrifice CZXP:</span><br>{{parseInt(sacrifice_czxp).toLocaleString()}}</div>
			          </div>
			        </div>
		        </div>
          </div>
        </div>
        <div v-if="!isOwned">
         <div id="buyBtnwrapper" 
          v-if="in_store == 'Store' && cost > 0"
            v-b-tooltip="buyBtnTooltipText">
            <button id="buyButton" :disabled="wallet <= cost || czxpBalance < parseInt(unlock_czxp)" class="btn btn-danger" v-on:click="buyCard">
                Buy Card {{cost}}E <b-icon-lock-fill v-if="wallet <= cost || czxpBalance < parseInt(unlock_czxp)"></b-icon-lock-fill>
            </button>
          </div>
          <div id="getBtnwrapper" 
          v-if="in_store == 'Store' && cost == 0" 
          v-b-tooltip.hover="getBtnTooltipText">
            <button id="get-button"  v-on:click="getCard" class="btn btn-danger" :disabled="czxpBalance < parseInt(unlock_czxp)">
            Get Card {{type_id}} <b-icon-lock-fill v-if="czxpBalance < parseInt(unlock_czxp)"></b-icon-lock-fill>
            </button>
          </div>
        </div>
          <div id="ownedBtnwrapper" v-if="isOwned" v-b-tooltip.hover="this.getOwnedCardToolTipText">
            <button id="owned-button" disabled class="btn btn-info">
               <b-icon-lock-fill></b-icon-lock-fill> You already own this.
            </button>
          </div>
          <div class="sacrifice-wrapper" v-if="$route.path == '/crypt'">
            <div class="sacrifice-button">
               <button :disabled="isGiftingCard || isSacrificingCard" class="btn btn-danger" v-on:click="sacrificeCard">
                Sacrifice
              </button>
              <b-spinner v-if="isGiftingCard || isSacrificingCard" label="Spinning"></b-spinner>
            </div>
            <div class="float-right">
              <b-button :disabled="isGiftingCard || isSacrificingCard" class="btn btn-danger btn-gift" v-b-modal="'transfer-modal-'+id">
                <img src="@/assets/baseline_card_giftcard_white_24dp.png" />
              </b-button>
            </div>
          </div>
      </div>
      <br>
      <!--<div v-if="showTransaction == 1" class="alert alert-success alert-dismissible fade show" role="alert">-->
      <!--  <strong>Success!</strong> Tx# {{transaction_number}}-->
      <!--  <button type="button" class="close" data-dismiss="alert" aria-label="Close">-->
      <!--    <span aria-hidden="true">&times;</span>-->
      <!--  </button>-->
      <!--</div>-->

  </div>
</template>

<script>
import {showPendingToast, showSuccessToast, showRejectedToast} from '../util/showToast';

export default {
  name: 'OwnedCardContent',
  props: ['id','type_id','name','image','edition_total','cset','unlock_czxp','level','cost','buy_czxp','transfer_czxp','sacrifice_czxp','card_class', 'in_store', 'isOwned'],
  computed: {
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
    czxpBalance() {
      return parseInt(this.$store.state.czxpBalance);
    },
  },
  data () {
    return {
      wei : 1000000000000000000,
      showTransaction : 0,
      transaction_number : 0,
      newWallet : '',
      confirmTransferBtnDisabled : false,
      buyBtnTooltipTextContent: 'Click to buy a copy of this card',
      buyBtnBlockedTooltipTextContent:'You do not have enough Ether or CZXP tokens to purchase this card',
      getBtnTooltipTextContent: 'Click to get a copy of this card at no cost',
      getBtnBlockedTooltipTextContent: 'You do not have enough CZXP tokens to unlock this button and claim this Free card',
      getOwnedCardToolTipText: 'You can only purchase/claim 1 card of each type',
      isSacrificingCard: false,
      isGiftingCard: false
    }
  },
  methods : {
    buyCard : function(){
      console.log("Buying card:" + this.type_id);
      
      window.Cryptoz.deployed().then((instance) => {
        return instance.buyCard(this.type_id, {from: this.coinbase, value: Math.round(this.cost*this.wei)});
      }).then((res) => {
        this.showTransaction =1
        this.$store.dispatch('updateOwnerBalances')
      }).catch((err) => {
        console.log(err);
      })
    },
    getCard : function(){
      console.log("Claiming card:" + this.type_id);
      
      window.Cryptoz.deployed().then((instance) => {
        return instance.getFreeCard(this.type_id, {from: this.coinbase});
      }).then((res) => {
        console.log(res)
        this.showTransaction =1
        this.$store.dispatch('updateOwnerBalances')
      })
    },
    sacrificeCard : function() {
      console.log("Sacrificing card:" + this.id);
      showPendingToast(this)
      window.Cryptoz.deployed().then((instance) => {
        this.isSacrificingCard = true;
        return instance.sacrifice(this.id, {from:this.coinbase});
      }).then((res) => {
        console.log("sacrifice result: ", res);
        this.$store.dispatch('updateOwnerBalances')
      }).catch((err) => {
        this.isSacrificingCard = false;
        console.log(err.message);
        if (err.code === 4001) {
          showRejectedToast(this)
        }
      }).finally(() => {})
    },
    transferCard : function() {
      console.log('Transfer card called..' + this.id);
      
      //Disable the button so they dont mash it up
      this.confirmTransferBtnDisabled = true;
      //var toWallet = document.getElementById('toWallet').value
      
      console.log('to ' + this.newWallet)
      console.log('from ' + this.coinbase)
      var contract
      window.Cryptoz.deployed().then((instance) => {
        contract = instance
        this.isGiftingCard = true
        var modalName = 'transfer-modal-' + this.id;
        this.$bvModal.hide(modalName)
        showPendingToast(this)
        return contract.transferFrom(this.coinbase, this.newWallet, this.id, {from:this.coinbase});
      }).then((res) => {
        // console.log("transfer result: ", res);
        this.confirmTransferBtnDisabled = false;
        return contract.tokensOfOwner(this.coinbase)
      }).then(this.handleGetAllCards)
      .catch(() => {
        this.isGiftingCard = false
        this.confirmTransferBtnDisabled = false
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /* Layout */

.card-bg{
  display: inline-block;
  width:260px;
  height:400px;
  text-align: center;
  margin-bottom: 3px;
  padding-bottom: 4px;
  margin-right: 10px;
  background-repeat: no-repeat;
  background-size: 260px 420px;
  background-position: 0px;
}

.card-bg-6{
    background-image: url(assets/cryptoz_card_common_brown.svg);
}

.card-bg-5{
  background-image: url(assets/cryptoz_card_uncommon_blue.svg);
}

.card-bg-4{
  background-image: url(assets/cryptoz_card_rare_red.svg);
}

.card-bg-3{
  background-image: url(assets/cryptoz_card_epic_purple.svg);
}

.card-bg-2{
  background-image: url(assets/cryptoz_card_platinum.svg);
}

.card-bg-1{
  background-image: url(assets/cryptoz_card_diamond.svg);
}

.card-bg-back{
  background-image: url(assets/cryptoz_card_back.svg);
  padding:20px;
}


.card-img{
  display: block;
  position:relative;
  top:45px;
  right:-2px;
  max-width:80%;
  margin:0 auto;
}

.card-item-name{
  width:100%;
  position: relative;
  top: 66px;
  font-weight: bold;
}

.card-edition{
  position: relative;
  width: 100%;
  top: 49px;
  color: #DDD;
  font-weight: bold;
}

.card-level{
  position: relative;
  width:50px;
  top: 66px;
  right: -209px;
  font-weight: bold;
  color: #fff;
}

.card-czxp{
  position: relative;
  color:#fff;
  font-weight: bold;
  width: 100px;
  top: 89px;
  left:55px;
}

.card-txt-black{
 color: #000;
}

/* Back of card stuff */
.card-txt-white{
 color: #fff;
}

.back-container{
  position:relative;
  top:100px;
  background-color: rgba(200,200,200,0.7);
  padding:20px;
}

/**  animation   **/

@keyframes float {
	0% {
		transform: translatey(0px);
	}
	50% {
		transform: translatey(-20px);
	}
	100% {
		transform: translatey(0px);
	}
}

/** Card **/

/* entire container, keeps perspective */
.flip-container {
	perspective: 1000px;
}
	/* flip the pane when hovered */
	.flip-container:hover .flipper, .flip-container.hover .flipper {
		transform: rotateY(180deg);
	}

.flip-container, .front, .back {
	width: 232px;
	height: 410px;
}

/* flip speed goes here */
.flipper {
	transition: 0.6s;
	transform-style: preserve-3d;

	position: relative;
}

/* hide back of pane during swap */
.front, .back {
	backface-visibility: hidden;

	position: absolute;
	top: 0;
	left: 0;
}

/* front pane, placed above back */
.front {
	z-index: 2;
	/* for firefox 31 */
	transform: rotateY(0deg);
}

/* back, initially hidden pane */
.back {
	transform: rotateY(180deg);
}

  .alert {
    position: fixed;
    z-index: 1000;
    top: 28em;
    left:36em;
  }
  
  .btn-gift{
    color:#fff;
  }

.sacrifice-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sacrifice-button {
  display: flex;
}

.sacrifice-button button {
  margin-right: 10px;
}

</style>