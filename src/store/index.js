import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'

Vue.use(Vuex)

export const store = new Vuex.Store({
 strict: true,
 state,
 mutations: {
   // payload: {coinbase, balance}
  updateWallet (state, payload) {
    //make sure to shallow copy the object to ensure new reference
    //for watchers (oldVal vs newVal)
    state.web3 = {...state.web3, ...payload}
  },
  web3isConnected (state, payload) {
    state.web3 = {...state.web3, isConnected: payload}
  },
  chainChanged (state, payload) {
    state.web3 = {...state.web3, chainId: payload}
  },
  updateBalances (state) {
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
  setStoreCards(state, payload) {
    state.shop.cards = payload
  },
  updateMintedCountForCard(state, payload) {
    const { cardTypeId, editionNumber } = payload

    const cardIndex = state.shop.cards.findIndex(card => card.type_id === cardTypeId)
    state.shop.cards[cardIndex].edition_current = editionNumber
  }
 },
 actions: {
    updateWallet ({commit}) {
      window.web3.eth.getCoinbase((err, coinbase) => {
        if (err) {
          console.error('Error: ', err)
        }
        if (coinbase !== null) {
          window.web3.eth.getBalance(coinbase, (err, balance) => {
            commit('updateWallet', {coinbase, balance})
          })
        }
      })
      // commit('updateWallet', payload)
    },
    disconnnectWallet({commit}) {
      commit('updateWallet', {coinbase: null, balance: null})
    },
    web3isConnected({commit}, payload) {
      commit('web3isConnected', payload)
      if (payload === false) {
        commit('updateCardsOwned', 0)
        commit('updateBoostersOwned', 0)
        commit('updateCZXPBalance', 0)
      }
    },
    chainChanged({commit}, payload) {
      commit('chainChanged', payload)
    },
    updateOwnerBalances ({commit}, payload) {
      //console.log('updateBalances action called')
      commit('updateBalances', payload)
    },
    updateUniverseBalances({commit}, payload){
      //console.log('updateUniverseBalances action called',payload)
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
    },
    setStoreCards({commit}, payload) {
      commit('setStoreCards', payload)
    },
    updateMintedCountForCard({commit}, payload) {
      commit('updateMintedCountForCard', payload)
    }
 }
})
