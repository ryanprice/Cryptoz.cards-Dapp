<template>
  <div>
    <div class="jumbotron">
          <h1>Markets</h1>
          <br>

          <div class="row">

            <div class="col-6">
              <h3>Cryptoz Cards<br>BEP-721 NFT tokens are supported on the following auction marketplaces</h3>

              <a href="https://whalecrate.com/browse/cryptoz" target="_blank">
                <div class="market-btn">
                  <img class="opensea-logo" src="https://whalecrate.com/logo-wide.svg" align="absmiddle" /> <span class="opensea-header">Whalecrate</span>
                  <br>
                  <p>
                    Buy and sell curated digital items across multiple chains.
                  </p>
                </div>
              </a>

              <a href="https://treasureland.market/#/nft-market/cryptoz?sellingType=0&priceType=0&title=0&sortValue=1&page=1&project=20" target="_blank">
                <div class="market-btn">
                  <img class="opensea-logo" src="https://treasureland.market/static/media/logo.849b6817.svg" align="absmiddle" /> <span class="opensea-header">TreasureLand</span>
                  <br>
                  <p>
                    Frictionless NFT trading market.
                  </p>
                </div>
              </a>

            </div>

            <div class="col-6">
              <h3>CryptoZ eXPerience (CZXP <img class="czxp-logo" src="./assets/cryptokeeper_coin_binance.svg" />) <br>BEP-20 tokens are supported on the following token exchanges</h3>

              <a href="https://info.julswap.com/pair/0x0f4b077f27E687b1e77E4a1b9ce0B4eceE100EB6#/" target="_blank">
                <div class="market-btn">
                  <img class="uni-logo" src="https://pbs.twimg.com/media/ExUNkLKVEAIabAW.jpg" align="absmiddle" />
                   <span class="opensea-header">JulSwap</span>
                  <br>
                  <p>
                    JulSwap fully decentralized and powered by the Community Governance.
                  </p>
                </div>
              </a>

              <a href="https://1inch.exchange/#/CZXP/BNB" target="_blank">
                <div class="market-btn">
                  <img class="uni-logo" src="https://downloads.intercomcdn.com/i/o/241617/dc6bdc1d7b1bc0d6c33e904b/e1486b777bc88ddcdf2649b668e9fbcd.png" align="absmiddle" />
                   <span class="opensea-header">1inch Exchange</span>
                  <br>
                  <p>
                    1inch offers the best rates by discovering the most efficient swapping routes across all leading DEXes.
                  </p>
                </div>
              </a>

            </div>

          </div>

          <p style="margin-top:100px">If you have an NFT market on the Binance Smart Chain and would like to feature Cryptoz NFT Cards, you can use the contract TokenURI endpoints for automated metadata consumption. We currently follow the OpenSea metadata standard. For inquires <a href="mailto:contactus@cryptoz.cards?subject=NFT market integrations">please contact us</a> </p>

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
    width : 16%;
    margin-bottom : 10px;
  }
  .rb-logo{
    width:39%;
    margin-bottom : 10px;
  }
  .uni-logo {
    width : 16%;
    margin-bottom : 10px;
  }
  .czxp-logo {
    width:7%;
    margin-right:0.2em;
  }
  .market-btn:hover{
    color:#000;
    background-color:#ccc;
    padding:10px;
    max-height: fit-content;
    text-decoration:none;
    border:1px solid black;
  }
  a:hover{
    text-decoration: none;
  }
  .market-btn{
    color:#000;
    padding:10px;
    text-decoration:none;
    max-height: fit-content;
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
