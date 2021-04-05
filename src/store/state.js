let state = {
  dAppState: 'NOT_CONNECTED',
  web3: {
    chainId: null,
    coinbase: null,
    balance: null
  },
  contractInstance: {
    cryptoz: null,
    czxp: null,
  },
  isTransactionPending: false,

  //Component states
  ownerBalances:0,
  universeBalances:0,

  // wallet balances
  boostersOwned:0,
  cardsOwned:0,
  czxpBalance:0,

  //universe balances
  totalCzxpSupply:0,
  totalCryptozSupply:0,
  totalCryptozTypes:0,

  //blockchain events [objects]
  lastChainEvent:{},

  shop: {
    cards: [],
  },
}

export default state