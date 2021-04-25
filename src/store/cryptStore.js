import getCardType from "../util/getCardType";
import { dynamicSort, getRarity } from "../helpers";
import { RARITY_CLASSES } from "./cardStore";

export const FILTER_CRITERIA = {
  STORE: "STORE",
  BOOSTER: "BOOSTER",
};



export const CRYPT_MUTATIONS = {
  SET_CRYPT_CARDS: "SET_CRYPT_CARDS",
  SET_MODIFIED_CRYPT_CARDS: "SET_MODIFIED_CRYPT_CARDS",
  LOADING_CRYPT_CARDS: "LOADING_CRYPT_CARDS",
  LOADING_CRYPT_CARDS_FAILED: "LOADING_CRYPT_CARDS_FAILED",
  CLEAR_CRYPT_CARDS: "CLEAR_CRYPT_CARDS",
  GIFT_CRYPT_CARD: "GIFT_CRYPT_CARD",
  SACRIFICE_CRYPT_CARD: "SACRIFICE_CRYPT_CARD",
  ADD_BOOSTER_CARD: "ADD_BOOSTER_CARD",
};

const DEFAULT_CRYPT_STATE = {
  allCryptCards: [],
  modifiedCryptCards: [],
  isLoadingCrypt: false,
  failedToLoadCrypt: false,
  cryptLoaded: false,
};



const sortCards = (sortParam, cards) => {
  switch (sortParam.param) {
    case "edition_number":
      return cards.sort(
        dynamicSort("edition_current", sortParam.isDescending, false)
      );
    case "rarity":
      return cards.sort(
        dynamicSort(sortParam.param, sortParam.isDescending, true, getRarity)
      );
    default:
      return cards.sort(dynamicSort(sortParam.param, sortParam.isDescending));
  }
};

const filterCards = (filterBy, cards) => {
  switch (filterBy) {
    case FILTER_CRITERIA.STORE:
      return cards.filter((card) => card.in_store === "Store");
    case FILTER_CRITERIA.BOOSTER:
      return cards.filter((card) => card.in_store === "Booster");
    default:
      return cards;
  }
};

const getCryptCard = async (tokenId, instance) => {
  const ownedCard = await instance.methods.getOwnedCard(tokenId).call();
  const cardData = await getCardType(parseInt(ownedCard[0]));

  cardData.id = tokenId;
  let newAttr = {};

  cardData.attributes.forEach((attribute) => {
    newAttr[attribute.trait_type] = attribute.value;
  });

  cardData.attributes = newAttr;
  cardData.attributes.edition_current = parseInt(ownedCard[1]);
  if (cardData.attributes.edition_total == 0) {
    //unlimited
    cardData.attributes.edition_label =
      "#" + cardData.attributes.edition_current;
  } else {
    cardData.attributes.edition_label =
      "#" +
      cardData.attributes.edition_current +
      " of " +
      cardData.attributes.edition_total;
  }

  cardData.attributes.rarity = RARITY_CLASSES[cardData.attributes.rarity];

  newAttr = { ...newAttr, ...cardData };
  delete newAttr.attributes;

  return newAttr;
};

const cryptStore = {
  namespaced: true,
  state: DEFAULT_CRYPT_STATE,
  mutations: {
    [CRYPT_MUTATIONS.CLEAR_CRYPT_CARDS](state) {
      state = DEFAULT_CRYPT_STATE;
    },
    [CRYPT_MUTATIONS.SET_CRYPT_CARDS](state, payload) {
      state.allCryptCards = [...payload];
      state.cryptLoaded = true;
      state.isLoadingCrypt = false;
      state.failedToLoadCrypt = false;
    },
    [CRYPT_MUTATIONS.SET_MODIFIED_CRYPT_CARDS](state, payload) {
      const { sortParam, filterBy } = payload;
      const cryptCards = [...state.allCryptCards];
      
      let modifiedCards = cryptCards;
      if (sortParam) {
        modifiedCards = sortCards(sortParam, cryptCards);
      }

      if (filterBy) {
        modifiedCards = filterCards(filterBy, cryptCards);
      }

      state.modifiedCryptCards = [...modifiedCards]
    },
    [CRYPT_MUTATIONS.LOADING_CRYPT_CARDS](state) {
      state.isLoadingCrypt = true;
      state.cryptLoaded = false;
    },
    [CRYPT_MUTATIONS.LOADING_CRYPT_CARDS_FAILED](state) {
      state.failedToLoadCrypt = true;
      state.isLoadingCrypt = false;
      state.cryptLoaded = false;
    },
    [CRYPT_MUTATIONS.GIFT_CRYPT_CARD](state, payload) {
      state.allCryptCards = state.allCryptCards.filter(card => card.id !== payload.id);
      state.modifiedCryptCards = state.modifiedCryptCards.filter(card => card.id !== payload.id)
    },
    [CRYPT_MUTATIONS.SACRIFICE_CRYPT_CARD](state, payload) {
      state.allCryptCards = state.allCryptCards.filter(card => card.id !== payload.id);
      state.modifiedCryptCards = state.modifiedCryptCards.filter(card => card.id !== payload.id)
    },
    [CRYPT_MUTATIONS.ADD_BOOSTER_CARD](state, payload) {
      state.allCryptCards.unshift(payload);
      if (state.modifiedCryptCards.length > 0) {
        state.modifiedCryptCards.unshift(payload);
      }
    }
  },
  actions: {
    // 2 actions here have the same mutation with different names.
    // For view to have a better idea of what "modified" means.
    sortCryptCards({ commit }, payload) {
      commit(CRYPT_MUTATIONS.SET_MODIFIED_CRYPT_CARDS, {
        sortParam: payload.sortParam,
        filterBy: payload.filterBy,
      });
    },
    filterCryptCards({ commit }, payload) {
      commit(CRYPT_MUTATIONS.SET_MODIFIED_CRYPT_CARDS, {
        sortParam: payload.sortParam,
        filterBy: payload.filterBy,
      });
    },
    clearCards({ commit }) {
      commit(CRYPT_MUTATIONS.CLEAR_CRYPT_CARDS);
    },
    cardGifted({ commit }, payload) {
      commit(CRYPT_MUTATIONS.GIFT_CRYPT_CARD, payload);
    },
    cardSacrificed({ commit }, payload) {
      commit(CRYPT_MUTATIONS.SACRIFICE_CRYPT_CARD, payload);
    },
    async loadCryptCards({ commit, dispatch, rootState }, payload) {
      const { addressToLoad, isOwnCrypt } = payload;
      if (!addressToLoad) {
        return;
      }
      try {
        commit(CRYPT_MUTATIONS.LOADING_CRYPT_CARDS);

        const CryptozInstance = rootState.contractInstance.cryptoz;

        const tokensOfOwner = await CryptozInstance.methods.tokensOfOwner(addressToLoad).call();


        if (tokensOfOwner.length === 0) {
          console.log("Current address doesn't have any cards.");
          commit(CRYPT_MUTATIONS.SET_CRYPT_CARDS, [])
          return;
        }

        const cryptCards = await Promise.all(
          tokensOfOwner.map((token) =>
            getCryptCard(parseInt(token), CryptozInstance)
          )
        );

        cryptCards.sort((a, b) => b.id - a.id);

        if (isOwnCrypt) {
          dispatch("updateCardsOwned", cryptCards.length, { root: true });
        }

        commit(CRYPT_MUTATIONS.SET_CRYPT_CARDS, cryptCards);
      } catch (err) {
        console.error(err);
        commit(CRYPT_MUTATIONS.LOADING_CRYPT_CARDS_FAILED);
      }
    },
    async addBoosterCard({commit, rootState}, payload) {
      const { cardId } = payload;

      try {
        const CryptozInstance = rootState.contractInstance.cryptoz;

        const cardData = await getCryptCard(cardId, CryptozInstance);

        commit(CRYPT_MUTATIONS.ADD_BOOSTER_CARD, cardData)

        return cardData;
      } catch (err) {
        console.error('Failed to get opened booster card. ', cardId);
        return null;
      }
    }
  },
  getters: {
    getIfOwnsCards: (state) => {
      return state.allCryptCards.length > 0;
    },
    getPaginatedCryptCards: (state) => (pageSize, pageStart, isSortedOrFiltered) => {
      const cardsToReturn = isSortedOrFiltered
        ? state.modifiedCryptCards
        : state.allCryptCards;

      if (cardsToReturn.length === 0) {
        return [];
      }

      let pageNext, endIndex;
      if (!!pageStart) {
        if (pageStart + pageSize > cardsToReturn.length) {
          pageNext = null;
          endIndex = cardsToReturn.length;
        } else {
          pageNext = pageStart + pageSize;
          endIndex = pageStart + pageSize;
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

      if (!!pageStart) {
        return {
          cards: cardsToReturn.slice(pageStart, endIndex),
          next: pageNext,
        };
      } else {
        return {
          cards: cardsToReturn.slice(0, endIndex),
          next: pageNext,
        };
      }
    },
    isLoadingCrypt: (state) => state.isLoadingCrypt,
    isCryptLoaded: (state) => state.cryptLoaded,
  },
};

export default cryptStore;
