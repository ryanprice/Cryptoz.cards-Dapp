import getCardType from "../util/getCardType";
import { dynamicSort, getRarity, soldOutSort } from "../helpers";

const typeIdsOnChain = [];


//push Apr 22,2021
typeIdsOnChain.push(253,250,255,254);
//push Apr 20,2021
typeIdsOnChain.push(242,239,241,237);
//push Apr 18,2021
typeIdsOnChain.push(230,231,229,223);
//push Apr 16,2021
typeIdsOnChain.push(214,215,216,213);
//push Apr 13,2021
typeIdsOnChain.push(197);
//push Apr 12,2021
typeIdsOnChain.push(195,194);
//push Apr 11,2021
typeIdsOnChain.push(139,193,196);
//push Apr 8,2021
typeIdsOnChain.push(166,165,164);
//push Apr 7,2021
typeIdsOnChain.push(163);
//push Apr 4,2021
typeIdsOnChain.push(138, 140);
//push Apr 1,2021
typeIdsOnChain.push(135, 136, 137);
//push March 31,2021
typeIdsOnChain.push(131, 132, 133, 134);
//push March 27,2021
typeIdsOnChain.push(64, 71, 74, 79, 84, 87, 91, 93, 95, 96, 104);
//push March 20,2021
typeIdsOnChain.push(47, 51, 58, 60, 61, 63);
//push March 20,2021
typeIdsOnChain.push(34, 38, 41, 43);
//push March 19,2021
typeIdsOnChain.push(13, 18, 19, 26);
//Dirty hack until we figure this event log shite out
typeIdsOnChain.push(4, 5, 8, 22, 29, 31, 45, 56, 81, 101, 102, 103);

const DEFAULT_CARD_STATE = {
  allShopCards: [],
  sortedCards: [],
  isLoadingShop: false,
  failedToLoadShop: false,
  shopLoaded: false,
};

export const CARD_MUTATIONS = {
  SET_SHOP_CARDS: "SET_SHOP_CARDS",
  LOADING_SHOP_CARDS: "LOADING_SHOP_CARDS",
  LOADING_SHOP_CARDS_FAILED: "LOADING_SHOP_CARDS_FAILED",
  SET_SORTED_CARDS: "SET_SORTED_CARDS",
  SET_CARD_BOUGHT: "SET_CARD_BOUGHT",
  SET_CARD_NOT_BOUGHT: "SET_CARD_NOT_BOUGHT",
  SET_CARD_EDITION: "SET_CARD_EDITION",
};

export const RARITY_CLASSES = {
  Common: "card-bg card-bg-6",
  Uncommon: "card-bg card-bg-5",
  Rare: "card-bg card-bg-4",
  Epic: "card-bg card-bg-3",
  Platinum: "card-bg card-bg-2",
  Diamond: "card-bg card-bg-1"
};

/**
 * Hack for our edition bug
 * Key: card ID
 * Value: hard coded edition total
 *
 * If we need to add further hacks, just append an entry to this object
 */
const EDITION_HACK = {
  102: 5,
  103: 1,
  5: 110,
  22: 179,
  56: 112,
  19: 80,
  43: 215,
  26: 288,
  104: 7,
  93: 49,
  74: 189,
  79: 299,
  96: 109,
  60: 384,
  133: 309,
  135: 204,
  137: 3,
  138: 159,
  165: 12,
  193: 222,
  196: 130,
  197: 14,
  213: 135,
  214: 165,
  241: 18,
  242: 12,
};

const getCard = async (cardId, CryptozInstance) => {
  const res = await getCardType(cardId);
  if (!res) {
    console.log(`Failed to fetch card ${cardId}.json`);
    return;
  }

  let cardObj = { ...res };

  cardObj.id = cardId;

  if (res.attributes[3].value !== "Store") {
    return;
  }

  // using for..of here so I can use continue
  for (const attribute of res.attributes) {
    if (attribute.trait_type === "rarity") {
      cardObj["rarity"] = RARITY_CLASSES[attribute.value];
      continue;
    }
    cardObj[attribute.trait_type] = attribute.value;
  }

  const edition = await CryptozInstance.methods
    .cardTypeToEdition(cardObj.id)
    .call();

  cardObj.edition_current = parseInt(edition);

  if (EDITION_HACK[cardObj.id]) {
    cardObj.edition_total = EDITION_HACK[cardObj.id];
  }

  // Set soldOut flag first
  if (cardObj.edition_current == cardObj.edition_total) {
    cardObj.soldOut = 1;
  } else {
    cardObj.soldOut = 0;
  }

  return cardObj;
};

const addIsOwnedProp = async (card, CryptozInstance, coinbase) => {
  const isOwned = await CryptozInstance.methods
    .cardTypesOwned(coinbase, card.id)
    .call();
  card.isOwned = isOwned;

  return card;
};

const cardStore = {
  state: DEFAULT_CARD_STATE,
  mutations: {
    [CARD_MUTATIONS.SET_CARD_EDITION](state, payload) {
      const { cardId, edition, isSorted } = payload;

      if (isSorted) {
        const sortedIndex = state.sortedCards.findIndex(
          (card) => card.id === cardId
        );
        state.sortedCards[sortedIndex].edition_current = edition;
      }

      const index = state.allShopCards.findIndex((card) => card.id === cardId);
      state.allShopCards[index].edition_current = edition;
    },
    [CARD_MUTATIONS.SET_CARD_BOUGHT](state, payload) {
      const { cardId, isSorted } = payload;
      const parsedCardId = parseInt(cardId);

      if (isSorted) {
        const cardSortedIndex = state.sortedCards.findIndex(
          (card) => card.id === parsedCardId
        );
        state.sortedCards[cardSortedIndex].isOwned = true;
      } else {
        const cardBoughtIndex = state.allShopCards.findIndex(
          (card) => card.id === parsedCardId
        );
        state.allShopCards[cardBoughtIndex].isOwned = true;
      }
    },
    [CARD_MUTATIONS.SET_CARD_NOT_BOUGHT](state, payload) {
      const { cardId, isSorted } = payload;
      const parsedCardId = parseInt(cardId);

      if (isSorted) {
        const cardSortedIndex = state.sortedCards.findIndex(
          (card) => card.id === parsedCardId
        );
        state.sortedCards[cardSortedIndex].isOwned = false;
      } else {
        const cardBoughtIndex = state.allShopCards.findIndex(
          (card) => card.id === parsedCardId
        );
        state.allShopCards[cardBoughtIndex].isOwned = false;
      }
    },
    /**
     * @param {DEFAULT_CARD_STATE} state
     * @param {Array<card>} payload
     *
     */
    [CARD_MUTATIONS.SET_SHOP_CARDS](state, payload) {
      state.allShopCards = [...payload].sort(soldOutSort);
      state.shopLoaded = true;
      state.isLoadingShop = false;
      state.failedToLoadShop = false;
    },
    [CARD_MUTATIONS.LOADING_SHOP_CARDS](state) {
      state.isLoadingShop = true;
      state.shopLoaded = false;
    },
    [CARD_MUTATIONS.LOADING_SHOP_CARDS_FAILED](state) {
      state.failedToLoadShop = true;
      state.shopLoaded = false;
    },
    [CARD_MUTATIONS.SET_SORTED_CARDS](state, payload) {
      const { allShopCards, sortParam } = payload;
      const shopCards = [...allShopCards];

      switch (sortParam.param) {
        case "edition_number":
          shopCards.sort(
            dynamicSort("edition_current", sortParam.isDescending, false)
          );
          break;
        case "rarity":
          shopCards.sort(
            dynamicSort(
              sortParam.param,
              sortParam.isDescending,
              true,
              getRarity
            )
          );
          break;
        default:
          shopCards.sort(dynamicSort(sortParam.param, sortParam.isDescending));
          break;
      }

      state.sortedCards = shopCards;
    },
    updateMintedCountForCard(state, payload) {
      const { cardTypeId, editionNumber } = payload;

      const cardIndex = state.allShopCards.findIndex(
        (card) => card.type_id === cardTypeId
      );
      if (cardIndex > -1) {
        state.allShopCards[cardIndex].edition_current = editionNumber;
      }

      if (state.sortedCards.length > 0) {
        const sortedIndex = state.sortedCards.findIndex(
          (card) => card.type_id === cardTypeId
        );
        state.sortedCards[sortedIndex].edition_current = editionNumber;
      }
    },
  },
  actions: {
    async setCurrentEdition({ commit, rootState }, payload) {
      try {
        const CryptozInstance = rootState.contractInstance.cryptoz;

        const { cardId, isSorted } = payload;
        const parsedId = parseInt(cardId);

        const edition = await CryptozInstance.methods
          .cardTypeToEdition(parsedId)
          .call();

        commit(CARD_MUTATIONS.SET_CARD_EDITION, {
          cardId: parsedId,
          edition,
          isSorted,
        });
      } catch (err) {
        console.error(err);
      }
    },
    async fetchStoreCards({ commit, rootState }) {
      try {
        const CryptozInstance = rootState.contractInstance.cryptoz;
        commit(CARD_MUTATIONS.LOADING_SHOP_CARDS);

        const results = await Promise.all(
          typeIdsOnChain.map(async (id) => {
            const cardData = await getCard(id, CryptozInstance);

            if (!cardData) {
              return;
            }

            return rootState.web3.coinbase
              ? await addIsOwnedProp(
                  cardData,
                  CryptozInstance,
                  rootState.web3.coinbase
                )
              : cardData;
          })
        );
        const storeCards = results.filter((result) => result !== undefined);
        commit(CARD_MUTATIONS.SET_SHOP_CARDS, storeCards);
      } catch (err) {
        console.error("Failed to load shop cards", { err });
        commit(CARD_MUTATIONS.LOADING_SHOP_CARDS_FAILED);
      }
    },
    sortCards({ commit, state }, payload) {
      commit(CARD_MUTATIONS.SET_SORTED_CARDS, {
        allShopCards: state.allShopCards,
        sortParam: payload,
      });
    },
    setCardAsBought({ commit }, payload) {
      commit(CARD_MUTATIONS.SET_CARD_BOUGHT, payload);
    },
    setCardAsNotBought({ commit }, payload) {
      commit(CARD_MUTATIONS.SET_CARD_NOT_BOUGHT, payload);
    },
    updateMintedCountForCard({ commit }, payload) {
      commit("updateMintedCountForCard", payload);
    },
  },
  getters: {
    getPaginatedShopCards: (state) => (pageSize, start, isSorted) => {
      const cardsToReturn = isSorted ? state.sortedCards : state.allShopCards;
      if (cardsToReturn.length === 0) {
        return [];
      }

      let pageNext, endIndex;
      if (!!start) {
        if (start + pageSize > cardsToReturn.length) {
          pageNext = null;
          endIndex = cardsToReturn.length;
        } else {
          pageNext = start + pageSize;
          endIndex = start + pageSize;
        }
      } else {
        if (pageSize > cardsToReturn.length) {
          pageNext = null;
          endIndex = cardsToReturn.length;
        } else {
          pageNext = pageSize;
          endIndex = pageSize;
        }
      }

      if (!!start) {
        // Return pagesize from this start
        return {
          cards: cardsToReturn.slice(start, endIndex),
          next: pageNext,
        };
      } else {
        return {
          cards: cardsToReturn.slice(0, endIndex),
          next: pageNext,
        };
      }
    },
    isLoadingShopCards: (state) => {
      return state.isLoadingShop;
    },
    isLoadingShopFailed: (state) => {
      return state.failedToLoadShop;
    },
    isShopLoadingFinished: (state) => {
      return state.shopLoaded;
    },
  },
};

export default cardStore;
