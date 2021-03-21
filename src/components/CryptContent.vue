<template>
  <div>

    <!-- Open Booster Modal -->
    <b-modal
      id="open-booster-modal"
      title="Enter a CZXP burn wager amount to increase the odds of pulling a rare or epic card ( czxp gone forever ):"
      ok-variant="danger"
      ok-title="Open Booster"
      hide-footer
    >
          <div>Enter 0 for no wager</div>
          <div><b>To wager:</b> Minimum = 2,000,000,000, Maximum = 1,649,267,441,667,000 </div>
          <router-link to='/help?read-cards'>Random odds explained</router-link>
          <b-form-input class="form-control" :state="isWagerValid"  required type="number" v-model="wagerAmount" ></b-form-input>
          <b-form-invalid-feedback  v-if="!notEnoughWager">
            <div>You need to enter a number between 2,000,000,000 and 1,649,267,441,667,000 to wager.</div>
          </b-form-invalid-feedback>
          <b-form-invalid-feedback v-if="notEnoughWager">
            <div>You do not have enough CZXP tokens</div>
          </b-form-invalid-feedback>
      <b-row>
        <b-col>
          <b-button class="mt-3" variant="danger" v-b-tooltip.hover="'Open Booster'" block @click="openBooster" :disabled="!isWagerValid">Mint random NFT</b-button>
        </b-col>
        <b-col>
          <b-button class="mt-3" block @click="$bvModal.hide('open-booster-modal')">Cancel</b-button>
        </b-col>
      </b-row>
    </b-modal>

    <div class="jumbotron">
      <UniverseBalances></UniverseBalances>

          <h1>Your NFT Wallet</h1>
          <p>This is where all your NFT Cryptoz tokens can be accessed. Sort, search, gift and sacrifice. Sacrificing is permanent, not only in your wallet but across the entire Cryptoz Universe. That unique NFT is burned forever.</p>

          <!-- Loads cards here -->
            <div class="row">
              <div class="col">
                <b-button v-b-tooltip.hover="'Mint 1 random booster NFT'" class="btn btn-danger" v-bind:disabled="boostersOwned < 1" v-on:click="openBooster">Open <b-icon-lightning-fill /> Booster Card
                </b-button>
              </div>
              <div class="col buy-and-open-booster">
                <b-button v-b-tooltip.hover="'Mint 1 random booster NFT +120 CZXP'" class="btn btn-danger" v-bind:disabled="web3.balance < 2000000000000000" v-on:click="buyAndOpenBooster">Buy and Open <b-icon-lightning-fill /> Booster 0.002 BNB
                </b-button>
              </div>
            </div>
            <br>

            <OwnerBalances></OwnerBalances>

            <br>

            <div class="row">
              <div id="button-container" class="row" v-if="ownsCards">
                <SortDropdown @sort-by-attr="sortByAttr"></SortDropdown>
                <b-button
                  id="view-change-button"
                  variant="info"
                  @click="() => toggleTableView()">
                  {{ 'View ' + (isTableView ? 'Gallery' : 'Table') }}
                </b-button>
              </div>
            </div>
            <br>
            <div v-if="ownsCards">
              <div v-if="isTableView">
                <b-table
                  :items="orderedCards"
                  :fields="tableFields"
                  small striped responsive
                >
                  <template #cell(name)="row" >
                    <div class="cell card-name-cell">
                      <img :src="row.item.image" :class="`cell mr-4 ${row.item.rarity}`">
                      {{ row.item.name }}
                    </div>
                  </template>
                  <template #cell(card_level)="row">
                    <div class="cell">{{ row.item.card_level }}</div>
                  </template>
                  <template #cell(edition)="row">
                    <div class="cell">{{ row.item.edition_label }}</div>
                  </template>
                  <template #cell(unlock_czxp)="row">
                    <div class="cell">{{ parseInt(row.item.unlock_czxp).toLocaleString() }}</div>
                  </template>
                  <template #cell(sacrifice_czxp)="row">
                    <div class="cell">{{ parseInt(row.item.sacrifice_czxp).toLocaleString() }}</div>
                  </template>
                  <template #cell(transfer_czxp)="row">
                    <div class="cell">{{ parseInt(row.item.transfer_czxp).toLocaleString() }}</div>
                  </template>
                  <template #cell(sacrifice)="row">
                    <div class="cell">
                      <b-button
                        size="md"
                        @click="sacrificeCard(row.item.id)"
                        variant="danger"
                        :disabled="cardsBeingGifted[row.item.id] || cardsBeingSacrificed[row.item.id]"
                      >
                        <span class='emoji'>☠️</span>
                      </b-button>
                    </div>
                  </template>
                  <template #cell(gift)="row">
                    <div class="cell">
                      <b-button
                        size="md"
                        @click="openGiftModal(row.item.id)"
                        variant="danger"
                        :disabled="cardsBeingGifted[row.item.id] || cardsBeingSacrificed[row.item.id]"
                      >
                        <!--img src="@/assets/baseline_card_giftcard_white_24dp.png" /-->
                        <b-icon-gift-fill />
                      </b-button>
                    </div>
                  </template>
                </b-table>
              </div>
              <div class="row" v-else>
                <div v-for="card in orderedCards" :key="card.id" class="card-wrapper">
                  <OwnedCardContent
                    :id="card.id"
                    :type_id="card.type_id"
                    :name="card.name"
                    :cost="card.cost"
                    :cset="card.card_set"
                    :edition_current="card.edition_current"
                    :edition_total="card.edition_total"
                    :level="card.card_level"
                    :unlock_czxp="card.unlock_czxp"
                    :buy_czxp="card.buy_czxp"
                    :transfer_czxp="card.transfer_czxp"
                    :sacrifice_czxp="card.sacrifice_czxp"
                    :image="card.image"
                    :card_class="card.rarity"
                    :in_store="card.in_store"
                    :card_owned="true"
                  ></OwnedCardContent>
                  <div class="sacrifice-wrapper" v-if="$route.path == '/crypt'">
                    <div class="sacrifice-button">
                      <button
                        :disabled="cardsBeingGifted[card.id] || cardsBeingSacrificed[card.id]"
                        class="btn btn-danger"
                        v-on:click="sacrificeCard(card.id)"
                        v-b-tooltip.hover="'Sacrifice'"
                      >
                        <span class='emoji'>☠️</span>
                      </button>
                    </div>
                    <b-spinner v-if="cardsBeingGifted[card.id] || cardsBeingSacrificed[card.id]" label="Spinning"></b-spinner>
                    <div class="float-right">
                      <b-button
                        :disabled="cardsBeingGifted[card.id] || cardsBeingSacrificed[card.id]"
                        class="btn btn-danger btn-gift"
                        @click="openGiftModal(card.id)"
                        v-b-tooltip.hover="'Gift'"
                      >
                        <b-icon-gift style="color:white" />
                      </b-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else><h2>You do not own any Cryptoz<br><router-link to="/shop">To get Free Cryptoz NFTs or Buy one, visit the Minting Shop</router-link></h2></div>
        </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import OwnedCardContent from '@/components/OwnedCardContent.vue'
import UniverseBalances from '@/components/UniverseBalances.vue'
import OwnerBalances from '@/components/OwnerBalances.vue'
import SortDropdown from '@/components/SortDropdown.vue'
import {showPendingToast, showSuccessToast, showRejectedToast, showErrorToast} from '../util/showToast';
import getCardTypes from '../util/getCardType'
import {getEditionNumber, getRarity, dynamicSort} from '../helpers'

export default {
  name: 'CryptContent',
  components : {
    OwnedCardContent,
    UniverseBalances,
    OwnerBalances,
    SortDropdown
  },
  data () {
    return {
      subscriptionState:0, // 0=idle,1=active
      ownsCards : false,
      el : 0,
      confirmOpenBtnDisabled : 0,
      wagerAmount : 0,
      orderedCards: [],
      sortType: null,
      isDescending: true,
      isTableView: false,
      tableFields: ["name", "card_level", "edition", "unlock_czxp", "sacrifice_czxp", "transfer_czxp", "sacrifice", "gift"],
      confirmTransferBtnDisabled : false,
      cardsBeingSacrificed: {},
      cardsBeingGifted: {},
      receivingWallet : '',
      notEnoughWager: false,
    }
  },
  mounted () {
    if(this.coinbase !== null){
      this.getAllCards();
    }
  },
  computed: {
    web3 () {
      return this.$store.state.web3
    },
    wallet () {
      return parseFloat(window.web3.fromWei(this.$store.state.web3.balance), 'ether');
    },
    coinbase() {
      return this.$store.state.web3.coinbase;
    },
    boostersOwned() {
      return this.$store.state.boostersOwned;
    },
    currentEvent() {
      return this.$store.state.lastChainEvent;
    },
    isWagerValid() {
      const wagerAmount = parseInt(this.wagerAmount)
      this.notEnoughWager = false;

      if (wagerAmount === 0) {
        return true;
      }

      if (this.czxp_balance < wagerAmount) {
        this.notEnoughWager = true;
        return false;
      }

      return wagerAmount >= 2000000000 && wagerAmount <= 1649267441667000
    },
    czxp_balance(){
      return this.$store.state.czxpBalance;
    },
  },
  watch: {
    'web3': {
      handler(val, oldVal) {
        if (val.coinbase !== oldVal.coinbase) {
          this.$bvModal.hide('gift-modal')
          this.$bvModal.hide('open-booster-modal')
          if (val.isConnected) {
            this.getAllCards()
          }
        }
      },
      deep: true
    },
    // TODO: figure out a more intelligent way of reloading cards.
    // 'currentEvent': {
    //   handler: function(newValue, oldValue) {
    //     if (newValue) {
    //       if(this.subscriptionState == 0){
    //         this.getAllCards();
    //       }
    //       if(oldValue && newValue.transactionHash !== oldValue.transactionHash){
    //         showSuccessToast(this, 'Confirmed! Balance updated')
    //       }
    //     }
    //   }
    // }
  },
  methods : {
    openGiftModal: function(id) {
      const h = this.$createElement
      const titleVNode = h('h5', `Gift Cryptoz NFT Token #${id} to another address`, { class: ['modal-title'] })
      const messageVNode = h('div', { class: ['modal-message'] }, [
        h('p', 'Enter a valid BSC wallet address to send this card to:', { class: [''] }),
        h('input', {
          on: { input: e => this.receivingWallet = e.target.value },
          props: {
            id: "toWallet",
          },
          style: {
            width: '100%'
          }
        })
      ])
      // We must pass the generated VNodes as arrays
      this.$bvModal.msgBoxConfirm([messageVNode], {
        title: [titleVNode],
        buttonSize: 'md',
        centered: true, size: 'md',
        id: 'gift-modal'
      })
      .then(value => {
        if (value) {
          // user pressed ok
          this.transferCard(id)
        }
        else {
          // user canceled
        }
      })
      .catch(err => {
        // An error occurred
        console.error(err)
      })
    },
    getAllCards : async function() {
      this.subscriptionState = 1;

      const instance = await window.Cryptoz.deployed();
      const tokensOfOwner = await instance.tokensOfOwner(this.coinbase);
      this.handleGetAllCards(tokensOfOwner)
    },
    toggleTableView: function() {
      const nextVal = !this.isTableView
      this.isTableView = nextVal
    },
    clearCards: function() {
      this.orderedCards = []
    },
    sacrificeCard : function(id) {
      showPendingToast(this)
      Vue.set(this.cardsBeingSacrificed, id, true)

      window.Cryptoz.deployed().then((instance) => {
        return instance.sacrifice(id, {from:this.coinbase});
      }).then((res) => {
        this.$store.dispatch('updateOwnerBalances')
        this.getAllCards()
      }).catch((err) => {
        // console.error(err);
        if (err.code === 4001) {
          showRejectedToast(this)
        }
      }).finally(() => {
        Vue.set(this.cardsBeingSacrificed, id, false)
        this.$store.dispatch('updateWallet')
      })
    },
    transferCard : function(id) {
      Vue.set(this.cardsBeingGifted, id, true)
      //Disable the button so they dont mash it up
      this.confirmTransferBtnDisabled = true;

      // console.log('to ' + this.receivingWallet)
      // console.log('from ' + this.coinbase)
      var contract
      window.Cryptoz.deployed().then((instance) => {
        contract = instance
        showPendingToast(this)
        return contract.transferFrom(this.coinbase, this.receivingWallet, id, {from:this.coinbase});
      }).then((res) => {
        this.confirmTransferBtnDisabled = false;
        return contract.tokensOfOwner(this.coinbase)
      }).then(this.handleGetAllCards)
      .catch(() => {
        this.confirmTransferBtnDisabled = false
      })
      .finally(() => {
        Vue.set(this.cardsBeingGifted, id, false)
        this.$store.dispatch('updateWallet')
      })
    },
    buyAndOpenBooster : function() {
      showPendingToast(this);
      window.Cryptoz.deployed().then((instance) => {
        return instance.buyBoosterCardAndOpen({from: this.coinbase, value:2000000000000000});
      })
      //update boosters owned and total types
      .then(() => {
        this.$bvModal.hide('open-booster-modal')
        this.getAllCards()
      })
      .catch((err) => {
        console.log(err.message);
        if (err.code === 4001) {
         showRejectedToast(this);
        }
      })
      .finally(() => {
        this.$store.dispatch('updateWallet')
      })
    },
    handleGetAllCards : async function(res) {
      if(res.length > 0){
        var self= this;
        //first we update the view
        this.ownsCards = true;

        //Place to track our token array data
        var tokenIdList = {};

        //Define a function to do all our handling and chain the data before passing back to our view
        var getCard = function(tokenId){
          return new Promise((resolve, reject) => {
            window.Cryptoz.deployed().then(function(instance) {
              return instance.getOwnedCard(tokenId)
            }).then(function(elementReturned) {
              tokenIdList[tokenId] = elementReturned

              return getCardTypes(elementReturned[0].c[0])
            }).then(function(res){
              res.id = tokenId;

              let newAttr = {}
              res.attributes.forEach(function(element){
                newAttr[element.trait_type] = element.value;
              })

              //Overwrite our JSON reponse with vue friendly card binding data
              res.attributes = newAttr;
              res.attributes.edition_current = tokenIdList[tokenId][1].c[0]

              //Edition total
              // #4  , #4 of 300
              if(res.attributes.edition_total == 0) //unlimited
              {
                res.attributes.edition_label = '#'+res.attributes.edition_current;
              }else{
                res.attributes.edition_label = '#'+res.attributes.edition_current +' of '+res.attributes.edition_total;
              }

              switch(res.attributes.rarity){
                case "Common":
                  res.attributes.rarity = 'card-bg card-bg-6';
                  break;
                case "Uncommon":
                  res.attributes.rarity = 'card-bg card-bg-5';
                  break;
                case "Rare":
                  res.attributes.rarity = 'card-bg card-bg-4';
                  break;
                case "Epic":
                  res.attributes.rarity = 'card-bg card-bg-3';
                  break;
                case "Diamond":
                  res.attributes.rarity = 'card-bg card-bg-2';
                  break;
                case "Platinum":
                  res.attributes.rarity = 'card-bg card-bg-1';
                  break;
              }

              newAttr = {...newAttr, ...res};
              delete newAttr.attributes

              resolve(newAttr)
            })
            .catch((err) => {
              reject(err)
            })
          })
        }

        //asynchronously get all our cards
        this.orderedCards = await Promise.all(
          res.map(element => getCard(element.c[0]))
        )
        this.orderedCards.sort((a,b) => b.id - a.id)
        
        if (this.sortType) {
          this.sortByAttr(this.sortType, this.isDescending)
        }
        this.$store.dispatch('updateCardsOwned', this.orderedCards.length)

      }else{
        console.log('no cards returned from handleGetAllCards()');
        this.ownsCards = false; //set the message to buy or get Cryptoz
      }
      //we are done, clear the state
      this.subscriptionState = 0;
    },
    openBooster : function () {

      console.log('Wagering..' + this.wagerAmount);

      //Change buy button to pending.. or show some pending state
      showPendingToast(this);
      var self = this;

      this.$bvModal.hide('open-booster-modal')

      window.Cryptoz.deployed().then(function(instance) {
        return instance.openBoosterCard(0, {from: self.coinbase});
      })
      .then(res => {
        if (res === undefined) {
          throw new Error('result is undefined in openBooster')
        } else {
          this.getAllCards()
        }
      })
      .catch(err => {
        console.log(err);
        if (err.code === 4001) {
          showRejectedToast(self);
        }
      })
      .finally(() => {
        this.$store.dispatch('updateWallet')
      })
    },
    sortByAttr: function(param, isDescending) {
      console.log({param, cards: this.orderedCards})
      this.sortType = param
      this.isDescending = isDescending
      switch(param) {
        case "edition_number":
          this.orderedCards.sort(dynamicSort('edition_current', isDescending, false));
          break
        case "rarity":
          this.orderedCards.sort(dynamicSort(param, isDescending, true, getRarity))
          break
        default:
          this.orderedCards.sort(dynamicSort(param, isDescending))
          break
      }
    }
  }
}

/*
  Ok we need to track the state of the Crypt
  LoggedIn true or false
  ownsCards true or false
  Sorted By
    Name
    Date Type loaded
    Limited Edition
*/

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .jumbotron {
    margin: auto;
    width: 95%;
  }
  .spinner {
    width: 2em;
  }

  .spinner-wrapper {
    display: flex;
    margin: 0px 8px;
  }

  .buy-and-open-booster {
    display: flex;
  }

  table .cell {
    height: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  #button-container {
    margin-left: 1rem;
    display: flex
  }

  #view-change-button {
    margin-left: 0.5rem;
  }

  .sacrifice-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding-left:1.2rem;
  }

  .emoji {
    font-size: 18px;
  }

  .card-bg {
    padding:2px;
  }

  .card-bg-6{
    background-color: rgba(84,81,97,0.5);
    border: 2px solid rgb(84,81,97);
  }

  .card-bg-5{
    background-color: rgba(43,164,250,0.5);
    border: 2px solid rgb(43,164,250);
  }

  .card-bg-4{
    background-color: rgba(202,60,44,0.5);
    border: 2px solid rgb(202,60,44);
  }

  .card-bg-3{
    background-color: rgba(87,69,229,0.5);
    border: 2px solid rgb(87,69,229);
  }

  #open-booster-modal div {
    margin-bottom: 10px;
  }

  /*plat and diamond borders*/
  /*
  .card-bg-2{
  }

  .card-bg-1{
  }
  */
</style>
