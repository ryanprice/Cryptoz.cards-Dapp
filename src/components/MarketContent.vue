<template>
  <div>
    <div class="jumbotron">
      <h1>Markets</h1>
      <br />

      <div class="row">
        <div class="col">
          <h3>
            Cryptoz Cards
          </h3>
          <h5> 
            BEP-721 NFT tokens are supported on the following
            auction marketplaces
          </h5>

          <a href="https://whalecrate.com/browse/cryptoz" target="_blank">
            <div class="market-btn">
              <img
                class="logo"
                src="https://whalecrate.com/logo-wide.svg"
                align="absmiddle"
              />
              <span class="opensea-header">Whalecrate</span>
              <br />
              <p>Buy and sell curated digital items across multiple chains.</p>
            </div>
          </a>

          <a href="https://www.aotoy.club/" target="_blank">
            <div class="market-btn">
              <img
                class="logo"
                src="https://www.aotoy.club/img/logo.4e931c7f.svg"
                align="absmiddle"
              />
              <span class="opensea-header">- BSC NFT Platform</span>
              <br />
              <p>
                Easily mint, collect, and trade your NFT, all on aotoy, the NFT
                platform deployed on the BSC.
              </p>
            </div>
          </a>

          <a
            href="https://treasureland.market/#/nft-market/cryptoz?sellingType=0&priceType=0&title=0&sortValue=1&page=1&project=20"
            target="_blank"
          >
            <div class="market-btn">
              <img
                id="treasureland-logo"
                src="https://treasureland.market/static/media/logo.849b6817.svg"
                align="absmiddle"
              />
              <span class="opensea-header">TreasureLand</span>
              <br />
              <p>Frictionless NFT trading market.</p>
            </div>
          </a>
        </div>
        <!-- End nft column -->

        <div class="col">

          <h3>
            CryptoZ eXPerience (CZXP
            <img
              class="czxp-logo"
              src="./assets/cryptokeeper_coin_binance.svg"
            />)
          </h3>
          <h5>
            BEP-20 tokens are supported on the following token exchanges
          </h5>

          <a
            href="https://info.julswap.com/pair/0x0f4b077f27E687b1e77E4a1b9ce0B4eceE100EB6#/"
            target="_blank"
          >
            <div class="market-btn">
              <img
                class="uni-logo"
                src="https://pbs.twimg.com/media/ExUNkLKVEAIabAW.jpg"
                align="absmiddle"
              />
              <span class="opensea-header">JulSwap</span>
              <br />
              <p>
                JulSwap fully decentralized and powered by the Community
                Governance.
              </p>
            </div>
          </a>

          <a href="https://1inch.exchange/#/CZXP/BNB" target="_blank">
            <div class="market-btn">
              <img
                class="uni-logo"
                src="https://downloads.intercomcdn.com/i/o/241617/dc6bdc1d7b1bc0d6c33e904b/e1486b777bc88ddcdf2649b668e9fbcd.png"
                align="absmiddle"
              />
              <span class="opensea-header">1inch Exchange</span>
              <br />
              <p>
                1inch offers the best rates by discovering the most efficient
                swapping routes across all leading DEXes.
              </p>
            </div>
          </a>
        </div>
      </div>

      <p>
        If you have an NFT market on the Binance Smart Chain and would like to
        feature Cryptoz NFT Cards, you can use the contract TokenURI endpoints
        for automated metadata consumption. We currently follow the OpenSea
        metadata standard. For inquires
        <a href="mailto:contactus@cryptoz.cards?subject=NFT market integrations"
          >please contact us</a
        >
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "MarketContent",
  data() {
    return {
      msg: "Here we go, here we go",
    };
  },
};
</script>
<style scoped>
  .col {
    min-width: 320px;
  }

  .opensea-header {
    font-size: 2rem !important;
    margin-left: 10px;
  }

  #treasureland-logo {
    height: 45px;
  }

  .logo {
    height: 25px;
  }
  .uni-logo {
    height: 40px;
    margin-bottom: 10px;
  }
  .czxp-logo {
    height: 30px;
  }
  .market-btn:hover {
    color: #000;
    background-color: #ccc;
    padding: 10px;
    max-height: fit-content;
    text-decoration: none;
    border: 1px solid black;
  }
  a:hover {
    text-decoration: none;
  }
  .market-btn {
    color: #000;
    padding: 10px;
    text-decoration: none;
    max-height: fit-content;
    border: 1px solid white;
    margin-bottom: 5px;
  }
  h3 {
    margin-bottom: 1em;
  }

  .jumbotron {
    margin: auto;
    width: 95%;
  }
</style>
