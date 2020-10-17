import {store} from '../store'
// import Web3 from 'web3'

window.addEventListener('load', async () => {
    window.ethereum.autoRefreshOnNetworkChange = false
//     // Modern dapp browsers...
//     if (window.ethereum) {
//         window.web3 = new Web3(ethereum);
//         try {
//             // Request account access if needed
//             // ethereum.enable()
//             // .then(() => {
//             //     // Acccounts now exposed
//             //     console.log('!!!!! WE ARE IN, from getPermissions on load');
//             // })
//             // .catch(() => {
//             //     console.log('canceled metamask')
//             // });
            
//             //Go through the web3 registration process
//             // store.dispatch('registerWeb3')
            
//         } catch (error) {
//             // User denied account access...
//             console.log('User denied permission:', error);
//         }
//     }
//     // Legacy dapp browsers...
//     else if (window.web3) {
//         window.web3 = new Web3(web3.currentProvider);
//         // Acccounts always exposed
//         //Go through the web3 registration process
//         // store.dispatch('registerWeb3')
//     }
});
