<template>
  <div>
    <div class="jumbotron">
          <h1>Markets</h1>
          <br>
          
          <div class="row">
            <div class="col-6">
              <h3>Cryptoz Cards<br>erc-721 tokens are supported on the following auction marketplaces</h3>
              
              <a href="https://rinkeby.opensea.io/assets/cryptoz-cards-v6" target="_blank">
                <div class="market-btn">
                  <img class="opensea-logo" src="https://opensea.io/static/images/logos/opensea-logo.png" align="absmiddle" /> <span class="opensea-header">OpenSea</span>
                  <br>
                  <p>
                    The world’s largest digital marketplace for crypto collectibles.<br> Buy, sell, and discover exclusive digital assets.
                  </p>
                </div>
              </a>
              
              <a href="https://rarebits.io/" target="_blank">
                <div class="market-btn">
                  <img class="rb-logo" src="https://lever-client-logos.s3.amazonaws.com/b5195801-463f-4953-9cee-332ab2414511-1526322100422.png" align="absmiddle" />
                  <br>
                  <p>
                    Buy, sell, and discover unique crypto assets<br>Zero Fees.
                  </p>
                </div>
              </a>
              
            </div>
            
            <div class="col-6">
              <h3>CryptoZ eXPerience (CZXP <img class="czxp-logo" src="@/assets/czxp.png" />) <br>erc-20 tokens are supported on the following token exchanges</h3>
              
              <a href="https://idex.market/eth/czxp" target="_blank">
                <div class="market-btn">
                  <img class="idex-logo" src="https://idex.market/assets/IDEX_sf-color.svg" align="absmiddle" />
                  <br>
                  <p>
                    Decentralized Ethereum Asset Exchange
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
  .idex-logo {
    width : 30%;
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