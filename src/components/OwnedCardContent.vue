<template>
  <div>

<!-- Transfer card Modal -->
<div class="modal fade" :id="'transfer-modal-'+id" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
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
        <button type="button" class="btn btn-danger" :disabled="confirmTransferBtnDisabled == 1" v-on:click="transferCard">Confirm Transfer</button>
      </div>
    </div>
  </div>
</div>
    
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
                <div class="card-czxp text-left">{{unlock_czxp}}</div>
                <div class="card-level">{{level}}</div>
              </div>
            </div>
		        <div class="back">
              <!-- back content -->
              <div class="card-bg card-bg-back">
			          <div class="back-container">
			            <div class="card-txt-black"><span class="font-weight-bold">Cost:</span> {{cost}}</div>
			            <br>
			            <div class="card-txt-black"><span class="font-weight-bold">Buy CZXP:</span><br>{{buy_czxp}}</div>
			            <div class="card-txt-black"><span class="font-weight-bold">Transfer CZXP:</span><br>{{transfer_czxp}}</div>
			            <div class="card-txt-black"><span class="font-weight-bold">Sacrifice CZXP:</span><br>{{sacrifice_czxp}}</div>
			          </div>
			        </div>
		        </div>
          </div>
        </div>
          <button class="btn btn-danger" v-if="in_store == 'Store' && cost > 0" v-bind:disabled="balance <= cost" v-on:click="buyCard">
            Buy Card {{cost}}E
          </button>
          <button class="btn btn-danger" v-else-if="in_store == 'Store' && cost == 0" v-on:click="getCard">
            Get Card {{type_id}}
          </button>
          <div v-else-if="$route.path == '/crypt'">
            <button class="btn btn-danger" v-on:click="sacrificeCard">
              Sacrifice {{id}}
            </button>
            <div class="float-right">
              <button class="btn btn-danger btn-gift" data-toggle="modal"  :data-target="'#transfer-modal-'+id">
                <img src="static/baseline_card_giftcard_white_24dp.png" />
              </button>
            </div>
          </div>
      </div>
      <br>
      <div v-if="showTransaction == 1" class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>Success!</strong> Tx# {{transaction_number}}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

  </div>
</template>

<script>
export default {
  name: 'OwnedCardContent',
  props: ['id','type_id','name','image','edition_total','cset','unlock_czxp','level','cost','buy_czxp','transfer_czxp','sacrifice_czxp','card_class', 'in_store'],
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
  data () {
    return {
      showTransaction : 0,
      transaction_number : 0,
      newWallet : '',
      confirmTransferBtnDisabled : 0,
    }
  },
  methods : {
    buyCard : function(){
      console.log("Buying card:" + this.type_id);
      var self = this;
      
      Cryptoz.deployed().then(function(instance) {
        return instance.buyCard(self.type_id, {from: self.coinbase, value:(self.cost*1000000000000000000)});
      }).then(function(res) {
        console.log(res);
        self.showTransaction =1
        //self.transaction_number = res.tx
        //self.$emit('child-sent')
      })
    },
    getCard : function(){
      console.log("Claiming card:" + this.type_id);
      var self = this;
      
      Cryptoz.deployed().then(function(instance) {
        return instance.getFreeCard(self.type_id, {from: self.coinbase});
      }).then(function(res) {
        console.log(res)
        self.showTransaction =1
        //self.transaction_number = res.tx
        //self.$emit('child-sent')
      })
    },
    sacrificeCard : function() {
      console.log("Sacrificing card:" + this.id);
      var self = this;
      
      Cryptoz.deployed().then(function(instance) {
        return instance.sacrifice(self.id, {from:self.coinbase});
      }).then(function(res){
        console.log("sacrifice result:");
        console.log(res);
        self.$emit('card-updated')
      })
    },
    transferCard : function() {
      console.log('Transfer card called..' + this.id);
      
      //Disable the button so they dont mash it up
      this.confirmTransferBtnDisabled = 1;
      
      //var toWallet = document.getElementById('toWallet').value
      
      console.log('to ' + this.newWallet)
      console.log('from ' + this.coinbase)
      
      var self = this
      var acct = window.account
      
      Cryptoz.deployed().then(function(instance) {
        console.log(window.account+' '+self.newWallet+' '+self.id)
        return instance.transferFrom(self.coinbase, self.newWallet, self.id, {from:account});
      }).then(function(res){
        //console.log("tranfer result:");
        //console.log(res);
        var modalName = 'transfer-modal-' + self.id;
        console.log('closing modal' + modalName);
        
        document.getElementById(modalName).modal({show:false});
        self.confirmTransferBtnDisabled = 0;
        self.$emit('card-updated')
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

</style>