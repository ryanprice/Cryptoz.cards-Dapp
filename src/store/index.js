import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import { showSuccessToast } from "../util/showToast";
import cardStore from './cardStore';

Vue.use(Vuex)

export const store = new Vuex.Store({
  state,
  mutations: {
    setContractInstance (state, payload) {
      state.contractInstance = payload
    },
    updateWallet (state, payload) {
      state.web3 = {...state.web3, ...payload}
    },
    web3isConnected (state, payload) {
      state.web3 = {...state.web3, isConnected: payload}
    },
    chainChanged (state, payload) {
      state.web3 = {...state.web3, chainId: payload}
    },
    setLastEvent (state, payload) {
      state.lastChainEvent = payload
    },
    updateCZXPBalance (state, payload) {
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
      if (cardIndex > -1) {
        state.shop.cards[cardIndex].edition_current = editionNumber
      }
    }
  },
  actions: {
    setContractInstance ({commit}, payload) {
      commit('setContractInstance', payload)
    },
    async updateWallet ({commit}) {
      // Wrapped Promise so we can 'await' this dispatch in App.vue
      return new Promise((resolve, reject) =>
        window.web3.eth.getCoinbase((err, coinbase) => {
          if (err) {
            console.error('Error: ', err)
          }
          if (coinbase !== null) {
            window.web3.eth.getBalance(coinbase, (err, balance) => {
              resolve(commit('updateWallet', {coinbase, balance}))
            })
          }
        })
      )
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
    async updateOwnerBalances ({commit}) {
      const { cryptoz, czxp } = this.state.contractInstance
      const coinbase = this.state.web3.coinbase
      const czxpBalancePromise = czxp.balanceOf(coinbase);
      const cryptozBalancePromise = cryptoz.balanceOf(coinbase);
      const boosterPacksOwnedPromise = cryptoz.boosterPacksOwned(coinbase);

      const [czxpBalance, cryptozBalance, boosterPacksOwned] = await Promise.all([czxpBalancePromise, cryptozBalancePromise, boosterPacksOwnedPromise])
      commit('updateCZXPBalance', czxpBalance.toNumber().toLocaleString())
      commit('updateCardsOwned', cryptozBalance.toNumber().toLocaleString())
      commit('updateBoostersOwned', boosterPacksOwned.toNumber().toLocaleString())
    },
    async updateUniverseBalances({commit}, payload){
      const { cryptoz, czxp } = this.state.contractInstance
      const totalCzxpPromise = czxp.totalSupply();
      const totalTypesPromise = cryptoz.getTotalTypes();
      const totalCryptozPromise = cryptoz.totalSupply();

      const [totalCzxp, totalTypes, totalCryptoz] = await Promise.all([totalCzxpPromise, totalTypesPromise, totalCryptozPromise])
      commit('updateCZXPTotal', parseInt(totalCzxp).toLocaleString())
      commit('updateTypesTotal', parseInt(totalTypes).toLocaleString())
      commit('updateCryptozTotal', parseInt(totalCryptoz).toLocaleString())
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
    },
    setLastEvent ({commit}, payload) {
      commit('setLastEvent', payload)
    },
  },
  modules: {
    cards: cardStore
  }
})
