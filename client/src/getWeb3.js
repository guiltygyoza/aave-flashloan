import Web3 from "web3";

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener("load", async () => {

      // Legacy dapp browsers...
      if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = new Web3(window.web3.currentProvider);
        console.log("Injected web3 detected.");
        resolve(web3);
      }
      else {
        alert("Please connect to Metamask for this demonstration.")
      }
    });
  });

export default getWeb3;
