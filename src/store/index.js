import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getWeb3 from '../util/getWeb3'
import pollWeb3 from '../util/pollWeb3'
import watchEvents from '../util/watchEvents'


Vue.use(Vuex)


export const store = new Vuex.Store({
 strict: true,
 state,
 mutations: {
  registerWeb3Instance (state, payload) {
    console.log('registerWeb3instance Mutation being executed', payload)
    let result = payload
    let web3Copy = state.web3
    web3Copy.coinbase = result.coinbase
    web3Copy.networkId = result.networkId
    web3Copy.balance = result.balance
    web3Copy.isInjected = result.injectedWeb3
    web3Copy.web3Instance = result.web3
    state.web3 = web3Copy
    state.czxpBalance = result.czxpBalance
    state.cardsOwned = result.cardsOwned
    state.boostersOwned = result.boostersOwned
    pollWeb3()
    watchEvents()
  },
  pollWeb3Instance (state, payload) {
    //console.log('pollWeb3Instance mutation being executed', payload)
    state.web3.coinbase = payload.coinbase
    state.web3.balance = payload.balance
  },
  updateCryptContent (state) {
    state.cryptContent += 1;
  },
  updateBalances (state, payload) {
    //console.log('mutate ownerbalances', payload);
    state.ownerBalances += 1;
  },
  updateUniverseBalances(state, payload) {
    console.log('mutate updateUniverseBalances');
    state.universeBalances += 1;
    if (payload) {
      state.lastChainEvent = payload;
    }
  },
  updateCZXPBalance (state, payload) {
    console.log("updateCZXPBalance state.." ,payload);
    state.czxpBalance = payload
  },
  updateCardsOwned (state, payload) {
    state.cardsOwned = payload
  },
  updateBoostersOwned (state, payload) {
    state.boostersOwned = payload
  },
  updateTypesTotal(state, payload) {
    state.totalCryptozTypes = payload
  },
  updateCZXPTotal(state, payload) {
    state.totalCzxpSupply = payload
  },
  updateCryptozTotal(state, payload) {
    state.totalCryptozSupply = payload
  },
  userLoggedOut(state,payload) {
    state.web3.isInjected = false;
  }
 },
 actions: {
   registerWeb3 ({commit}) {
      console.log('registerWeb3 Action being executed', commit)
      getWeb3.then(result => {
        console.log('committing result to registerWeb3Instance mutation', result)
        if(result !== undefined) {
          commit('registerWeb3Instance', result)
        }else{
          console.log('getWeb3 returned Nothing !..error in vuex index')
          console.log(window.web3)
        }
      }).catch(error => {
        console.log("Error in return from getWeb3.then:", error)
      })
    },
    pollWeb3Action ({commit}, payload) {
      //console.log('pollWeb3 action being executed')
      commit('pollWeb3Instance', payload)
    },
    updateCrypt ({commit}) {
      commit('updateCryptContent')
    },
    updateOwnerBalances ({commit}, payload) {
      //console.log('updateBalances action called')
      commit('updateBalances', payload)
    },
    updateUniverseBalances({commit}, payload){
      console.log('updateUniverseBalances action called')
      commit('updateUniverseBalances', payload)
    },
    updateCZXPBalance ({commit}, payload){
      commit('updateCZXPBalance', payload)
    },
    updateCardsOwned ({commit}, payload){
      commit('updateCardsOwned', payload)
    },
    updateBoostersOwned ({commit}, payload){
      commit('updateBoostersOwned', payload)
    },
    updateTypesTotal({commit}, payload){
      commit('updateTypesTotal', payload)
    },
    updateCZXPTotal({commit}, payload){
      commit('updateCZXPTotal', payload)
    },
    updateCryptozTotal({commit}, payload){
      commit('updateCryptozTotal', payload)
    },
    userLoggedOut({commit}){
      commit('userLoggedOut')
    }
 }
})
