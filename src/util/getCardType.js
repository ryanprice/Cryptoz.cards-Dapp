const getCardType = async (cardId) => {
    try {
        const cardType = await import("../card_types/" + cardId + ".json")
        return {
            ...cardType.default
        }
    } catch (err) {
        console.error(err);
    }
}

export default getCardType