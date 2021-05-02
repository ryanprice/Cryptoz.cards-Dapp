<template>
  <div>
    <div class="jumbotron">
          <h1>Markets</h1>
          <br>
          
          <div class="row">
            <div class="col-6">
              <h3>Cryptoz Cards<br>ERC721 NFT tokens are supported on the following auction marketplaces</h3>
              
              <a href="https://opensea.io/collection/cryptoz-cards/" target="_blank">
                <div class="market-btn">
                  <img class="opensea-logo" src="https://opensea.io/static/images/logos/opensea-logo.png" align="absmiddle" /> <span class="opensea-header">OpenSea</span>
                  <br>
                  <p>
                    View Cryptoz that are currently available in The world’s largest digital marketplace for crypto collectibles.<br> Buy, sell, and discover exclusive digital assets.
                  </p>
                </div>
              </a>
<!--
              <a href="https://info.uniswap.org/pair/0x3696e9044b189f16026e3c759aaebb70e31e612c" target="_blank">
                <div class="market-btn">
                  <img class="rb-logo" src="@/assets/256x256_App_Icon_Pink.svg" align="absmiddle" />
                  <span class="opensea-header">Uniswap</span>
                  <br>
                  <p>
                    Swap CZXP for ETH<br>Earn Fees for providing liquidity.
                  </p>
                </div>
              </a>
-->
            </div>
            
            <div class="col-6">
              <h3>CryptoZ eXPerience (CZXP <img class="czxp-logo" src="@/assets/czxp.png" />) <br>ERC20 tokens are supported on the following token exchanges</h3>
              
              <a href="https://info.uniswap.org/pair/0x3696e9044b189f16026e3c759aaebb70e31e612c" target="_blank">
                <div class="market-btn">
                  <img class="uni-logo" src="@/assets/256x256_Black-1.png" align="absmiddle" />
                   <span class="opensea-header">Uniswap</span>
                  <br>
                  <p>
                    Uniswap Decentralized Ethereum liquidity Exchange - Instant swap - CZXP-ETH. Earn fees by providing liquidity
                  </p>
                </div>
              </a>
            
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
    height:auto;
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
