let state = {
 web3: {
   isConnected: false,
   web3Instance: null,
   networkId: null,
   coinbase: null,
   balance: null,
   error: null
 },
 contractInstance: null,

//Component states
 cryptContent:0,
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
 lastChainEvent:''
}

export default state