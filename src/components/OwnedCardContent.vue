<template>
  <div id="card-container">
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
      </div>
      <br>

  </div>
</template>

<script>
import {showPendingToast, showSuccessToast, showRejectedToast} from '../util/showToast';

export default {
  name: 'OwnedCardContent',
  props: ['id', 'type_id', 'name', 'image', 'edition_total', 'cset', 'unlock_czxp',
    'level', 'cost', 'buy_czxp', 'transfer_czxp', 'sacrifice_czxp', 'card_class'],
  computed: {
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
	width: 240px;
	height: 410px;
}

#card-container {
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