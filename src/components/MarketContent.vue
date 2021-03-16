<template>
  <div>
    <div class="jumbotron">
          <h1>Markets</h1>
          <br>
          
          <div class="row">
            <div class="col-6">
              <h3>Cryptoz Cards<br>BEP-721 NFT tokens are supported on the following auction marketplaces</h3>
              
              <a href="https://treasureland.market/" target="_blank">
                <div class="market-btn">
                  <img class="opensea-logo" src="https://treasureland.market/static/media/logo.849b6817.svg" align="absmiddle" /> <span class="opensea-header">TreasureLand</span>
                  <br>
                  <p>
                    <strong>Coming Soon</strong><br/>
                    Build the most unique NFT frictionless trading market where users can enjoy the fun of gold mining.
                  </p>
                </div>
              </a>
            </div>
            
            <div class="col-6">
              <h3>CryptoZ eXPerience (CZXP <img class="czxp-logo" src="./assets/cryptokeeper_coin_binance.svg" />) <br>BEP-20 tokens are supported on the following token exchanges</h3>
              
              <a href="https://1inch.exchange/#/CZXP/BNB" target="_blank">
                <div class="market-btn">
                  <img class="uni-logo" src="https://downloads.intercomcdn.com/i/o/241617/dc6bdc1d7b1bc0d6c33e904b/e1486b777bc88ddcdf2649b668e9fbcd.png" align="absmiddle" />
                   <span class="opensea-header">1inch Exchange</span>
                  <br>
                  <p>
                    LEADING DEX AGGREGATOR<br/>
                    1inch offers the best rates by discovering the most efficient swapping routes across all leading DEXes.
                  </p>
                </div>
              </a>
              
              <!--a href="https://exchange.pancakeswap.finance/#/swap?inputCurrency=0x2b974da27c9dd35412d71dd36e3e108486c45444" target="_blank">
                <div class="market-btn">
                  <img class="uni-logo" src="@/assets/pancakeswap-cake-logo.png" align="absmiddle" />
                   <span class="opensea-header">PancakeSwap</span>
                  <br>
                  <p>
                    PancakeSwap Decentralized BSC liquidity Exchange - Instant swap - CZXP-BNB. Earn fees by providing liquidity
                  </p>
                </div>
              </a-->
              
              
              
              
            </div>
            
          </div>
          
          
          
          
          
          
          
            
        </div>
  </div>
</template>

<script>
export default {
  name: 'MarketContent',
  data () {
    return {
      msg: 'Here we go, here we go'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .opensea-header {
    font-size : 2rem!important;
    margin-left : 10px;
  }
  .opensea-logo {
    width : 10%;
    margin-bottom : 10px;
  }
  .rb-logo{
    width:39%;
    margin-bottom : 10px;
  }
  .uni-logo {
    width : 8%;
    margin-bottom : 10px;
  }
  .czxp-logo {
    width:7%;
    margin-right:0.2em;
  }
  .market-btn:hover{
    color:#000;
    background-color:#ccc;
    padding:5px;
    height:130px;
    text-decoration:none;
    border:1px solid black;
  }
  .market-btn{
    color:#000;
    padding:5px;
    text-decoration:none;
    height:130px;
    border:1px solid white;
    margin-bottom:5px;
  }
  h3{
    margin-bottom:1em;
  }
  
  .jumbotron {
    margin: auto;
    width: 95%;
  }
</style>