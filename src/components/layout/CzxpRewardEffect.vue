<template>
  <div
    id="animation-container"
    :class="{
      'bounce-animation' : playAnimation,
      'bounce-fixed-bottom': true,
      'bounce-bonus-text': true
    }"
  >
    +{{czxpAward}} <img class="bounce-coin-size" src="https://cryptoz.cards/assets/cryptokeeper_coin_binance.svg" />
  </div>
</template>

<script>
  import { MessageBus } from '@/messageBus'

  export default {
    name: 'CzxpRewardEffect',
    data () {
      return {
        playAnimation: false,
        czxpAward: 18,
      }
    },
    methods: {
      animate: function(value) {
        this.playAnimation = true
        this.czxpAward = value
        const czxp_bonus_sound = new Audio(require('../assets/czxp_gain.wav'));
        czxp_bonus_sound.play();
        
        setTimeout(() => {
          this.playAnimation = false
        }, 3000)
      }
    },
    computed: {
      czxp_balance() {
        return this.$store.state.czxpBalance;
      },
      coinbase_czxp_balance() {
        return {
          coinbase: this.$store.state.web3.coinbase,
          czxp_balance: this.$store.state.czxpBalance,
        }
      }
    },
    watch: {
      coinbase_czxp_balance(val, oldVal) {
        console.log({val, oldVal})
        if (val.czxp_balance && oldVal.czxp_balance && val.czxp_balance !== oldVal.czxp_balance && val.coinbase === oldVal.coinbase) {
          this.animate(val.czxp_balance-oldVal.czxp_balance)
        }
      }
    }
  }
</script>

<style scoped>
  /** Czxp bounce effect **/

  #animation-container {
    display: none;
  }

  .bounce-animation {
    display: block !important;
    position: relative;
    animation: bounce 4s 1;
  }

  @keyframes bounce {
    0%,10%,20%,30%,50%,100% {
      transform: translateY(0);
      opacity:0;
    }
    10% {
      transform: translateY(-90px);
      opacity:1;
    }
    20% {
      transform: translateY(-70px);
      opacity:1;
    }
    30% {
      transform: translateY(-90px);
      opacity:1;
    }
    40% {
      transform: translateY(-20px);
      opacity:0;
    }
  }

  .bounce-coin-size{
    width: 1em;
    position:relative;
    top:-1px;
  }
  .bounce-bonus-text{
    text-shadow: 1px 1px #013220;
    font-weight:bold;
    color:green;
    font-size: 22px;
    font-face:sans-serif;
  }
  .bounce-fixed-bottom {
    position: fixed;
    top: 150px;
    right: 10px;
  }
</style>
