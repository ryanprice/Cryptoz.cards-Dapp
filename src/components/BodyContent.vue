<template>
  <div>
        <main role="main" class="container">
        <div class="jumbotron">
          <h1>Cryptoz.cards</h1>
          <p class="lead">Cryptoz is an Ethereum blockchain based collectibles trade game.</p>
          <img class="img-responsive card-demo-group" src="static/cryptokeeper_card_types.png" />
          <p>
            The goal of the game is to collect the undead and earn or trade ERC-20 Cryptoz eXPerience (CZXP) tokens to unlock new levels. Each ERC-721 Cryptoz card is a unique token on the Ethereum blockchain. Players can buy, sell, and exchange both their Cryptoz cards and CZXP tokens through any ERC standards compliant wallet application, markets, game engines and exchanges.
            </p>
          <p>
            Ethereum token Cryptoz collecting and trading is an exciting and new opportunity for classic and modern collectors alike. What makes this platform unique compared to other online digital asset based games or systems are:
          </p>
          <ul>
            <li>The entire Cryptoz Platform is run on a set of contracts that run independantly of the creators, there is no OFF switch, Cryptoz live forever on Ethereum</li>
            <li>The developers can not tamper or change the Card types once they are loaded. i.e: no re-minting rare cards</li>
            <li>The cards are truly unique, owned and transferable between wallets manaully or on automated marketplace platforms</li>
          </ul>
      </div>
      </main>
  </div>
</template>

<script>
export default {
  name: 'BodyContent',
  data () {
    return {
      msg: 'Here we go, here we go'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .card-demo-group{
    float: right;
    width: 30%;
    margin-left: 4em;
    position: relative;
    top: -2em;
  }
</style>