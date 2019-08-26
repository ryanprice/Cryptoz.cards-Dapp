<template>
  <div>
    <main role="main" class="container">
      <div class="jumbotron">
        <h1>Frequently Asked Questions</h1>
        <div id="accordion" role="tablist">
        <div class="card">
          <div class="card-header" role="tab" id="headingOne">
            <h5 class="mb-0">
              <a data-toggle="collapse" href="#collapseOne" role="button" aria-expanded="true" aria-controls="collapseOne">
                How do I play ?
              </a>
            </h5>
          </div>
          <div id="collapseOne" class="collapse show" role="tabpanel" aria-labelledby="headingOne" data-parent="#accordion">
            <div class="card-body">
              You will need:
              <ul>
                <li>The <a href="https://metamask.io/" target="_blank">Metamask</a> Chrome browser extension, connected to your Ethereum wallet
                <li>A balance of Ether coins ( the money of Ethereum )</li>
              </ul>
              <p>You may then Log in with Metamask and <router-link to="/shop">Shop</router-link> for Booster cards, buy limited edition cards and claim Free limited editions cards. You may then browse the contents of <router-link to="/crypt">Your Crypt</router-link>, sacrifice cards from your Crypt or gift them to other Ethereum accounts. If you would like to <router-link to="/market">auction</router-link> your Cryptoz for profits, you may list them on OpenSea or other <router-link to="/market">supported marketplaces</router-link>. You can also trade and sell your CZXP on supported Ethereum token exchanges.</p>
            </div>
          </div>
        </div>
        <div class="card">
    <div class="card-header" role="tab" id="headingTwo">
      <h5 class="mb-0">
        <a class="collapsed" data-toggle="collapse" href="#collapseTwo" role="button" aria-expanded="false" aria-controls="collapseTwo">
          How can I get Ether ?
        </a>
      </h5>
    </div>
    <div id="collapseTwo" class="collapse" role="tabpanel" aria-labelledby="headingTwo" data-parent="#accordion">
      <div class="card-body">
        You will need to buy Ether or have it sent to your wallet. The quickest way to buy Ether is to:
        <ul>
          <li>Open Metamask</li>
          <li>Click on Deposit</li>
          <li>Buy on Coinbase</li>
        </ul>
        Follow the sign up on Coinbase, purchase some Ether. As of this writing, the transaction(gas) cost by Ethereum to interact with Cryptoz will cost approx $0.05 to $1.50 USD per transaction, depending on how fast you would like the transactions confirmed and what exactly you are trying to do. This fee is not charged by Cryptoz, but by the Ethereum platform to execute code for people on this massive worldscale computer
      </div>
    </div>
  </div>
        <div class="card">
    <div class="card-header" role="tab" id="headingTwohalf">
      <h5 class="mb-0">
        <a class="collapsed" data-toggle="collapse" href="#collapseTwohalf" role="button" aria-expanded="false" aria-controls="collapseTwo">
          What are sponsor affiliates ?
        </a>
      </h5>
    </div>
    <div id="collapseTwohalf" class="collapse" role="tabpanel" aria-labelledby="headingTwo" data-parent="#accordion">
      <div class="card-body">
        <p>The Cryptoz universe will reward sponsors who have been associated to an affiliate. You may sponsor any number of affiliate players. This affiliation is permanent and cannot be unmade. You may only have 1 sponsor, but may have any number of affiliates. There is a number of affiliate player actions that will generate a 20% CZXP reward for their sponsor.</p>
        <ul>
          <li>Buy Booster Credits</li>
          <li>Buy and Open a Booster Card</li>
          <li>Buy a limited edition card</li>
          <li>Minting a Free limited edition card from the Shop</li>
        </ul>
      </div>
    </div>
  </div>
        <div class="card">
    <div class="card-header" role="tab" id="headingThree">
      <h5 class="mb-0">
        <a class="collapsed" data-toggle="collapse" href="#collapseThree" role="button" aria-expanded="false" aria-controls="collapseThree">
          What are ERC20 and ERC721 tokens ?
        </a>
      </h5>
    </div>
    <div id="collapseThree" class="collapse" role="tabpanel" aria-labelledby="headingThree" data-parent="#accordion">
      <div class="card-body">
        <p>Cryptoz.cards utilize 2 types of Ethereum tokens:</p>
        <p>
          <strong>CZXP - CryptoZ eXPerience Tokens</strong> are ERC20 Fungible tokens. This means that 1 CZXP is exchangeable with any other CZXP token and none are unique.
        </p>
        <p>
          <strong>Cryptoz</strong> the cards themselves are ERC721 Non-Fungible tokens. This means that each card is a unique token. Even the Unlimted Booster cards that are minted in an infinite supply are each unique, they have a unique token number and a unique edition number.
        </p>
      </div>
    </div>
  </div>
        <div class="card">
    <div class="card-header" role="tab" id="headingFour">
      <h5 class="mb-0">
        <a class="collapsed" data-toggle="collapse" href="#collapseFour" role="button" aria-expanded="false" aria-controls="collapseFour">
          How many types of Cryptoz are available ?
        </a>
      </h5>
    </div>
    <div id="collapseFour" class="collapse" role="tabpanel" aria-labelledby="headingFour" data-parent="#accordion">
      <div class="card-body">
        The <router-link to="/shop">Shop</router-link> will show you the current total number of Cryptoz types available at the current time. We continue to load new sets containing approx 10-20 cards every month until we reach the hard limit of a total of 5000 types. The Ethereum contracts do not allow us or anyone to edit or overwrite a card types definition once they have been loaded.
      </div>
    </div>
  </div>
        <div class="card">
    <div class="card-header" role="tab" id="headingFive">
      <h5 class="mb-0">
        <a class="collapsed" data-toggle="collapse" href="#collapseFive" role="button" aria-expanded="false" aria-controls="collapseFive">
          What is the difference between Unlimited and the Limited edition card types ?
        </a>
      </h5>
    </div>
    <div id="collapseFive" class="collapse" role="tabpanel" aria-labelledby="headingFive" data-parent="#accordion">
      <div class="card-body">
        <ul>
          <li>
            An <strong>Unlimited edition</strong> card type will ONLY appear in the booster packs. These cards have an edition number starting at #1 and count up infinitely.
          </li>
          <li>
            A <strong>limited edition</strong> card is minted from the Shop and have a finite amount that will ever be created. You will see the current edition number on the card in a format like : #32 of 200
          </li>
        </ul>
      </div>
    </div>
  </div>
        <div class="card">
    <div class="card-header" role="tab" id="headingSix">
      <h5 class="mb-0">
        <a class="collapsed" data-toggle="collapse" href="#collapseSix" role="button" aria-expanded="false" aria-controls="collapseSix">
          How can I get more <img class="czxp-logo" src="static/czxp.png" /> CZXP tokens ?
        </a>
      </h5>
    </div>
    <div id="collapseSix" class="collapse" role="tabpanel" aria-labelledby="headingSix" data-parent="#accordion">
      <div class="card-body">
        There are multiple ways in which you can get CZXP - CryptoZ eXPerience tokens:
        <ul>
          <li>Buy Booster Credit(s) - 120 CZXP per</li>
          <li>Buy a Limited edition Cryptoz card - Check back of card for amount</li>
          <li>Claim a FREE Limited Edition Cryptoz Card - Check back of card for amount</li>
          <li>Sacrifice a Cryptoz card - Check back of card for amount</li>
          <li>Buy or exchange them on <router-link to="/market">supported ERC20 token exchanges</router-link></li>
          <li>Request them from other players</li>
          <li>Receive 20% of the amount earned by your affiliates purchase actions</li>
        </ul>
      </div>
    </div>
  </div>
      </div>
    </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'HelpContent',
  data () {
    return {
      msg: 'Here we go, here we go'
    }
  },
  methods : {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .czxp-logo {
    width:4%;
    margin-right:0.2em;
  }
</style>