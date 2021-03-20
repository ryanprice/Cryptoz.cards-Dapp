<template>
  <div>
    <main role="main" class="container">
    <!--
        brown       - 545161
        light blue  - 2BA4FA
        red         - CA3C2C
        purple      - 5745E5
    -->
      <div class="jumbotron">
        <h1>Frequently Asked Questions</h1>
        <div class="accordion" role="tablist">

          <b-card no-body class="mb-1">
            <b-card-header
              header-tag="header"
              class="accordion-header"
              role="tab"
            >
              <b-button block v-b-toggle.accordion-1 class="accordion-button"
                >How do I Play?</b-button
              >
            </b-card-header>
            <b-collapse
              id="accordion-1"
              visible
              accordion="my-accordion"
              role="tabpanel"
            >
              <b-card-body>
                <div class="card-body">
                  You will need:
                  <ul>
                    <li>
                      The
                      <a href="https://docs.binance.org/smart-chain/wallet/metamask.html" target="_blank"
                        >Metamask</a
                      >
                      Chrome browser extension, or other  Binance wallet
                    </li>
                    <li>A balance of BNB coins ( the money of Binance Smart Chain )</li>
                  </ul>
                  <p>
                    You may then Log in with your wallet and
                    <router-link to="/shop">Shop</router-link> for Booster
                    cards, buy limited edition cards and claim Free limited
                    editions cards from <router-link to="/shop">the Minting Shop.</router-link> You may then browse the contents of
                    <router-link to="/crypt">Your NFT Crypt</router-link>, sacrifice
                    cards from your Crypt for $CZXP tokens, or gift them to other BSC
                    accounts. If you would like to
                    <router-link to="/market">auction</router-link> your Cryptoz NFTs
                    , you may list them on
                    <router-link to="/market"
                      >supported marketplaces</router-link
                    >. You can also trade and sell your CZXP on supported
                    <router-link to="/market">BSC token exchanges.</router-link>
                  </p>
                </div>
              </b-card-body>
            </b-collapse>
          </b-card>

          <b-card no-body class="mb-1">
            <b-card-header
              header-tag="header"
              class="accordion-header"
              role="tab"
            >
              <b-button block v-b-toggle.accordion-1-5 class="accordion-button"
                >How do I read the cards?</b-button
              >
            </b-card-header>
            <b-collapse
              id="accordion-1-5"
              v-model="visible"
              accordion="my-accordion"
              role="tabpanel"
            >
              <b-card-body>
                <div class="card-body">
                    <img src="./assets/cryptoz_legend_binance.png" />
                </div>
                <p><h2>Rarity Distribution</h2>
                    <p>The rarity distribution for each Booster card pull is as follows:</p>
                    <ul>
                        <li><span class="rarity-labels" style="background-color:#C0C0C0">Platinum</span> - O - This type is not available for purchase or from a booster</li>
                        <li><span class="rarity-labels" style="background-color:#5745E5">Epic</span> - 1  in 10000 - This is like pulling a unicorn.</li>
                        <li><span class="rarity-labels" style="background-color:#CA3C2C">Rare</span> - 49 in 10000 - These red cards are still very rare and should be handled with care</li>
                        <li><span class="rarity-labels" style="background-color:#2BA4FA">Uncommon</span> - 2650 in 10000 - These when they occur, they are a nice little surprise</li>
                        <li><span class="rarity-labels" style="background-color:#545161">Common</span> - 7300 in 10000 - The editions on these will count up fairly quickly as cards get pulled</li>
                    </ul>
                </p>
              </b-card-body>
            </b-collapse>
          </b-card>

          <b-card no-body class="mb-1">
            <b-card-header
              header-tag="header"
              class="accordion-header"
              role="tab"
            >
              <b-button block v-b-toggle.accordion-2 class="accordion-button"
                >How can I get BNB?</b-button
              >
            </b-card-header>
            <b-collapse
              id="accordion-2"
              accordion="my-accordion"
              role="tabpanel"
            >
              <b-card-body>
                <div class="card-body">
                  You will need to buy BNB or have it sent to your wallet. The
                  quickest way to buy BNB is to:
                  <ul>
                    <li><a href="https://www.binance.com/" target="_blank">Trade at Binance</a></li>
                  </ul>
                  As of this writing, the transaction cost by the Binance Smart Chain (gas) to
                  interact with Cryptoz will cost approx $0.30 to $25.50 USD per
                  transaction, depending on how fast you would like the
                  transactions confirmed and what exactly you are trying to do.
                  <br/>
                  This fee is not charged by the Cryptoz contract, but by the Binance Smart Chain
                  platform to execute contract code for you by you on this massive worldscale
                  computer.
                </div>
              </b-card-body>
            </b-collapse>
          </b-card>

          <b-card no-body class="mb-1">
            <b-card-header
              header-tag="header"
              class="accordion-header"
              role="tab"
            >
              <b-button block v-b-toggle.accordion-3 class="accordion-button"
                >What are sponsor affiliates?</b-button
              >
            </b-card-header>
            <b-collapse
              id="accordion-3"
              accordion="my-accordion"
              role="tabpanel"
            >
              <b-card-body>
                <div class="card-body">
                  <p>
                    The Cryptoz universe will reward sponsors who have been
                    associated to an affiliate. This affiliation is permanent and cannot
                    be unmade. You may only have 1 sponsor,  but may have any
                    number of affiliates.<br/><br/>There are a number of affiliate player
                    actions that will generate a 20% CZXP reward for their
                    sponsor.
                  </p>
                  <ul>
                    <li>Buy Booster Credits</li>
                    <li>Buy and Open a Booster Card</li>
                    <li>Buy a limited edition card</li>
                    <li>Claim a Free limited edition card from the Shop</li>
                  </ul>
                  <p>Click the Sponsors link in the menu to copy your Afilliate URL to send to other players.</p>
                </div>
              </b-card-body>
            </b-collapse>
          </b-card>

          <b-card no-body class="mb-1">
            <b-card-header
              header-tag="header"
              class="accordion-header"
              role="tab"
            >
              <b-button block v-b-toggle.accordion-4 class="accordion-button"
                >What are BEP-20 and BEP-721 tokens?</b-button
              >
            </b-card-header>
            <b-collapse
              id="accordion-4"
              accordion="my-accordion"
              role="tabpanel"
            >
              <b-card-body>
                <div class="card-body">
                  <p>Cryptoz.cards utilize 2 types of BSC tokens:</p>
                  <p>
                    <img class="czxp-logo" src="./assets/cryptokeeper_coin_binance.svg" /> <strong>CZXP - CryptoZ eXPerience Tokens</strong> are BEP-20
                    Fungible tokens. This means that any CZXP is exchangeable with
                    any other CZXP token and none are unique.
                  </p>
                  <p>
                    <strong>Cryptoz</strong> the cards themselves are BEP-721
                    Non-Fungible tokens (NFTs). This means that each card is a unique
                    token. Even the Unlimited Booster cards that are minted in an
                    infinite supply are each unique, they have a unique token
                    number and a unique edition number.
                  </p>
                </div>
              </b-card-body>
            </b-collapse>
          </b-card>

          <b-card no-body class="mb-1">
            <b-card-header
              header-tag="header"
              class="accordion-header"
              role="tab"
            >
              <b-button block v-b-toggle.accordion-5 class="accordion-button"
                >How many types of Cryptoz are available?</b-button
              >
            </b-card-header>
            <b-collapse
              id="accordion-5"
              accordion="my-accordion"
              role="tabpanel"
            >
              <b-card-body>
                <div class="card-body">
                  The <router-link to="/shop">Shop</router-link> will show you
                  the current total number of Cryptoz types available at the
                  current time. We will continue to load new sets containing approx
                  10-20 cards every month until we reach the hard limit of a
                  total of 5000 types. The Cryptoz contracts will not allow
                  anyone to edit or overwrite a card types definition once they
                  have been loaded.
                </div>
              </b-card-body>
            </b-collapse>
          </b-card>
          <b-card no-body class="mb-1">
            <b-card-header
              header-tag="header"
              class="accordion-header"
              role="tab"
            >
              <b-button block v-b-toggle.accordion-6 class="accordion-button">
                What is the difference between Unlimited and the Limited edition
                card types?</b-button
              >
            </b-card-header>
            <b-collapse
              id="accordion-6"
              accordion="my-accordion"
              role="tabpanel"
            >
              <b-card-body>
                <div class="card-body">
                  <ul>
                    <li>
                      An <strong>Unlimited edition</strong> NFT card type will ONLY
                      appear in the booster cards. These cards have an edition
                      number starting at #1 and count up infinitely.
                    </li>
                    <li>
                      A <strong>limited edition</strong> NFT card is minted from the
                      Shop and have a finite amount that will ever be created.
                      You will see the current edition number on the NFT in a
                      format like : #2 of 6
                    </li>
                  </ul>
                </div>
              </b-card-body>
            </b-collapse>
          </b-card>
          <b-card no-body class="mb-1">
            <b-card-header
              header-tag="header"
              class="accordion-header"
              role="tab"
            >
              <b-button block v-b-toggle.accordion-7 class="accordion-button">
                How can I get more
                <img class="czxp-logo" src="./assets/cryptokeeper_coin_binance.svg" /> CZXP tokens
                ?</b-button
              >
            </b-card-header>
            <b-collapse
              id="accordion-7"
              accordion="my-accordion"
              role="tabpanel"
            >
              <b-card-body>
                <div class="card-body">
                  There are multiple ways in which you can get CZXP <img class="czxp-logo" src="./assets/cryptokeeper_coin_binance.svg" /> CryptoZ
                  eXPerience tokens:
                  <ul>
                    <li><router-link to="/shop"
                        >Buy Booster Credits</router-link> - 120 CZXP per</li>
                    <li>
                      <router-link to="/shop"
                        >Mint a Limited edition Cryptoz card from the Shop</router-link> - Check back of card
                      for amount
                    </li>
                    <li>
                      <router-link to="/shop"
                        >Mint a FREE Limited Edition Cryptoz Card from the Shop</router-link> - Check back of
                      card for amount
                    </li>
                    <li>
                      Buy and Open a Booster from Your <router-link to="/crypt"
                        >NFT Crypt</router-link>
                    </li>
                    <li>
                      <router-link to="/crypt"
                        >Sacrifice a Cryptoz NFT card ( permanently )</router-link> - Check back of card for amount
                    </li>
                    <li>
                      Buy or exchange czxp on
                      <router-link to="/market"
                        >supported BEP-20 token exchanges</router-link
                      >
                    </li>
                    <li>Request them from other players</li>
                    <li>
                      Receive 20% of the amount earned by your affiliates
                      purchase actions. Click the Affiliate link in the header for more information.
                    </li>
                  </ul>
                  <p><strong>Note : Minting a Booster Credit does NOT award you CZXP tokens.</strong></p>
                </div>
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "HelpContent",
  props: ['query'],
  data() {
    return {
      msg: "Here we go, here we go",
    };
  },
  methods: {},
  mounted() {
    //console.log('hello:',this.query);
    if(this.query !== ''){
        switch(this.query){
            case "read-cards" :
              // console.log('open tab 2');
              //this.accordion-1-5 = "visible";
        }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.czxp-logo {
  width: 4%;
  margin-right: 0.2em;
}

.accordion-header {
  padding: 0 !important;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.accordion-button {
  text-align: left;
  border-radius: 0;
  font-size: 1.25em;
}

.rarity-labels {
    color: white;
    padding: 2px 4px;
}
</style>
