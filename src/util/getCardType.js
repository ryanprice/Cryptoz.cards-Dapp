const getCardType = async (cardId) => {
    const cardType = await import("../card_types/" + cardId + ".json")

    return {
        ...cardType.default
    }
}

export default getCardType