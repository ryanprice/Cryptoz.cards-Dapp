<template>
  <div
    id="card-container"
    :class="{ fullsize: isFullSize }"
    @click="isFlipped = !isFlipped"
    @mouseleave="isFlipped = false"
  >
    <div
      id="flip-container"
      :class="{ flipped: isFlipped }"
    >
      <!-- front content -->
      <div :class="[card_class, 'front']">
        <!--img class="card-img" :src="'static/assets/' + url" /-->
        <div id="image-container">
          <img class="card-img" :src="image" />
        </div>
        <div id="card-edition">
          <span>{{ edition_label }}</span>
        </div>
        <div id="card-name">
          {{ name }}<br />{{ cset }}
        </div>
        <div id="bottom-text">
          {{ parseInt(unlock_czxp).toLocaleString() }}
        </div>
        <div id="bottom-right-corner">{{ level }}</div>
        <div class="card-booster-shop card-booster-shop-circle"></div>
        <div
          id="top-right-corner"
          :style="{ backgroundColor: activeColor }"
        >
          <b-icon-lightning-fill
            v-if="in_store == 'Booster'"
            class="card-booster-shop-icon"
            scale="1.3"
          />
          <b-icon-tag-fill
            v-if="in_store == 'Store'"
            class="card-booster-shop-icon"
            scale="1.3"
          />
        </div>
      </div>
      <div class="back card-bg card-bg-back-bsc">
        <div class="back-container">
          <div class="card-txt-black">
            <span class="attribute-name font-weight-bold">Cost:</span>
            <span>{{ cost }}</span>
          </div>
          <div class="card-txt-black">
            <span class="attribute-name font-weight-bold">Buy CZXP:</span>
            <span>{{ parseInt(buy_czxp).toLocaleString() }}</span>
          </div>
          <div class="card-txt-black">
            <span class="attribute-name font-weight-bold">Transfer CZXP:</span>
            <span>{{ parseInt(transfer_czxp).toLocaleString() }}</span>
          </div>
          <div class="card-txt-black">
            <span class="attribute-name font-weight-bold">Sacrifice CZXP:</span>
            <span>{{ parseInt(sacrifice_czxp).toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "OwnedCardContent",
  props: [
    "id",
    "type_id",
    "name",
    "image",
    "edition_current",
    "edition_total",
    "cset",
    "unlock_czxp",
    "level",
    "cost",
    "buy_czxp",
    "transfer_czxp",
    "sacrifice_czxp",
    "card_class",
    "in_store",
    "card_owned",
    "is_single_card_view",
  ],
  data() {
    return {
      isFlipped: false,
    }
  },
  computed: {
    activeColor() {
      if (this.in_store == "Store") {
        return "#FFA500"; //orange
      } else {
        return "#FFFF33"; //yellow
      }
    },
    edition_label() {
      if (!this.card_owned) {
        return this.edition_current + '/' + this.edition_total
      }
      else {
        if (this.edition_total === 0) {
          return '#'+this.edition_current;
        } else {
          return '#'+this.edition_current +' of '+this.edition_total;
        }
      }
    },
    isFullSize() {
      console.log(this.is_single_card_view)
      return this.is_single_card_view
    }
  },
  methods: {
    toggleFlipped() {
      this.isFlipped = !this.isFlipped
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* Layout */

.card-bg {
  display: inline-block;
  width: 100%;
  height: 100%;
  text-align: center;
  margin-bottom: 3px;
  padding-bottom: 4px;
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: 0px;
}

.card-bg-6 {
  background-image: url('https://cryptoz.cards/assets/cryptoz_card_common_brown.svg');
}

.card-bg-5 {
  background-image: url('https://cryptoz.cards/assets/cryptoz_card_uncommon_blue.svg');
}

.card-bg-4 {
  background-image: url('https://cryptoz.cards/assets/cryptoz_card_rare_red.svg');
}

.card-bg-3 {
  background-image: url('https://cryptoz.cards/assets/cryptoz_card_epic_purple.svg');
}

.card-bg-2 {
  background-image: url('https://cryptoz.cards/assets/cryptoz_card_platinum.svg');
}

.card-bg-1 {
  background-image: url('https://cryptoz.cards/assets/cryptoz_card_diamond.svg');
}

.card-bg-back {
  background-image: url(assets/cryptoz_card_back_binance.svg);
  padding: 20px;
}

.card-bg-back-bsc {
  background-image: url(assets/cryptoz_card_back_binance.svg);
  padding: 20px;
}

#image-container {
  position: absolute;
  top: 15%;
  left: 10%;
  right: 10%;
  height: 45%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.card-img {
  width: 80%;
}

#top-right-corner {
  position: absolute;
  top: 4%;
  right: 0;
  width: 19%;
  height: 12%;
  border-radius: 50%;
  border: 3px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
}

#bottom-right-corner {
  position: absolute;
  bottom: 1.5%;
  right: 0;
  width: 19%;
  height: 12%;
  display: flex;
  justify-content: center;
  align-items: center;

  font-weight: bold;
  color: #fff;
}

#card-edition {
  position: absolute;
  top: 62%;
  bottom: 32%;
  left: 10%;
  right: 10%;
  color: #ddd;
  font-weight: 700;
}

#card-name {
  font-weight: bold;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 15%;
}

#bottom-text {
  position: absolute;
  color: #fff;
  font-weight: bold;
  left: 21%;
  right: 21%;
  bottom: 4%;
  height: 7%;
  text-align: left;
  display: flex;
  align-items: center;
}

.card-txt-black {
  color: #000;
}

/* Back of card stuff */
.card-txt-white {
  color: #fff;
}

.back-container {
  position: absolute;
  top: 29%;
  bottom: 14%;
  left: 8%;
  right: 7%;
  background-color: rgba(200, 200, 200, 0.7);
  padding: 5%;

  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

/** Card **/

/* entire container, keeps perspective */


#card-container {
  margin: 0;
  height: 410px;
  width: 260px;

  font-size: 16px;

  perspective: 600px;
}

@media screen and (max-width: 800px) {
  #card-container {
    height: calc(0.55 * 410px);
    width: calc(0.55 * 260px);
    font-size: 10px;
  }

  .fullsize {
    height: 410px!important;
    width: 260px!important;
    font-size: 16px!important;
  }
}

/* flip the pane when hovered */
#flip-container.flipped {
  transform: rotateY(180deg);
}

#flip-container {
  transition: transform 0.6s;
  transform-style: preserve-3d;

  position: relative;
}
#flip-container,
.front,
.back {
  width: 100%;
  height: 100%;
}

@media (hover: hover) and (pointer: fine) {
  #card-container:hover #flip-container {
    transform: rotateY(180deg);
  }
}

/* hide back of pane during swap */
.front,
.back {
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

.attribute-name {
  padding-right: 5px;
}
</style>
