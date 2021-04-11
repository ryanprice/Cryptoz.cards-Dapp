import { store } from "../store/";

let watchEvents = function (
  CzxpInstance,
  CryptozInstance,
  { onCardMinted, onBalanceUpdated, onSponsorEvent }
) {
  CzxpInstance.events.allEvents(
    { fromBlock: "latest" },
    function (error, event) {
      const { coinbase } = store.state.web3;

      if (!error) {
        //IF event affects our wallet, dispatch
        const { to, from, player } = event.returnValues;
        if (
          coinbase &&
          [to, from, player]
            .filter((val) => val !== undefined)
            .find((val) => val.toLowerCase() === coinbase.toLowerCase())
        ) {
          store.dispatch("setLastEvent", event);
          store.dispatch("updateOwnerBalances");
          onBalanceUpdated();
        }
        //Otherwise a czxp event ALWAYS updates the universe balance
        store.dispatch("updateUniverseBalances");
      } else {
        console.log("ERROR in watchEvents.js czxpEvents : ", error);
      }
    }
  );

  CryptozInstance.events.allEvents(
    { fromBlock: "latest" },
    function (error, event) {
      const { coinbase } = store.state.web3;

      switch (event.event) {
        case "LogCardCreated":
          onCardMinted({
            cardTypeId: parseInt(event.returnValues.cardTypeId).toString(),
            editionNumber: parseInt(
              event.returnValues.editionNumber
            ).toString(),
          });
          break;
        case 'LogSponsorReward':
          if (coinbase.toLowerCase() === event.returnValues.sponsor.toLowerCase()) {
            onSponsorEvent(parseInt(event.returnValues.CzxpReward))
          }
          break;
        default:
          break;
      }
      if (!error) {
        const { to, from, player } = event.returnValues;
        if (
          coinbase &&
          [to, from, player]
            .filter((val) => val !== undefined)
            .find((val) => val.toLowerCase() === coinbase.toLowerCase())
        ) {
          store.dispatch("setLastEvent", event);
          store.dispatch("updateOwnerBalances");
          onBalanceUpdated();
        }
        //Otherwise a Cryptoz event ALWAYS updates the universe balance
        store.dispatch("updateUniverseBalances");
      } else {
        console.log("ERROR in watchEvents.js cryptozEvents: ", error);
      }
    }
  );
};

export default watchEvents
