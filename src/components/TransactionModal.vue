<template>
  <b-modal
    id="transaction-modal"
    title="Confirm Transaction"
    hide-footer
    centered
    v-model="isTransactionPending"
    no-close-on-backdrop
  >
    <span id="spinner-container">
      <img src="../../public/cryptokeeper_logo_binance.b2d477e6.png" />
      <b-spinner id="spinnyboi" />
    </span>
    <span>Please confirm the transaction.</span>
  </b-modal>
</template>

<script>
  export default {
    name: "TransactionModal",
    computed: {
      isTransactionPending: {
        get: function () {
          return this.$store.state.isTransactionPending;
        },
        set: function (value) {
          this.$store.dispatch('setIsTransactionPending', value)
        }
      }
    }
  }
</script>

<style lang="scss">
  .modal-body {
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 50px 0;
  }

  #spinner-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
    
    img {
      position: absolute;
      width: 85px;
      height: 85px;
    }
    #spinnyboi {
      width: 100px;
      height: 100px;
      background: transparent;
    }
  }
</style>