import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import { showSuccessToast } from "../util/showToast";

Vue.use(Vuex)

export const store = new Vuex.Store({
  state,
  mutations: {
    setContractInstance (state, payload) {
      state.contractInstance = payload
    },
    setDAppState (state, payload) {
      state.dAppState = payload
    },
    setIsTransactionPending (state, payload) {
      state.isTransactionPending = payload
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
    setDAppState ({commit}, payload) {
      commit('setDAppState', payload)
    },
    setIsTransactionPending({commit}, payload) {
      commit('setIsTransactionPending', payload)
    },
    disconnectWallet({commit}) {
      commit('updateWallet', {coinbase: null, balance: null})
    },
    chainChanged({commit}, payload) {
      commit('chainChanged', payload)
    },
    async updateOwnerBalances ({commit}) {
      const coinbase = await window.web3.eth.getCoinbase()
      if (!coinbase) {
        return
      }
      const balance = await window.web3.eth.getBalance(coinbase)

      commit('updateWallet', {coinbase, balance})

      const { cryptoz, czxp } = this.state.contractInstance
      const czxpBalancePromise = czxp.methods.balanceOf(coinbase).call();
      const cryptozBalancePromise = cryptoz.methods.balanceOf(coinbase).call();
      const boosterPacksOwnedPromise = cryptoz.methods.boosterPacksOwned(coinbase).call();

      const [czxpBalance, cryptozBalance, boosterPacksOwned] = await Promise.all([czxpBalancePromise, cryptozBalancePromise, boosterPacksOwnedPromise])

      commit('updateCZXPBalance', parseInt(czxpBalance).toLocaleString())
      commit('updateCardsOwned', parseInt(cryptozBalance).toLocaleString())
      commit('updateBoostersOwned', parseInt(boosterPacksOwned).toLocaleString())
    },
    async updateUniverseBalances({commit}, payload){
      const { cryptoz, czxp } = this.state.contractInstance

      const totalCzxpPromise = czxp.methods.totalSupply().call();
      const totalTypesPromise = cryptoz.methods.getTotalTypes().call();
      const totalCryptozPromise = cryptoz.methods.totalSupply().call();

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
  }
})
