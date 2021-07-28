import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { Moralis } from "moralis";


let isEthereumCompatible = false;

let subscribers = {
  'accountsChanged': [],
  'chainChanged': [],

}

function on(event, func) {
  let idx = subscribers[event].length;
  subscribers[event].push(func);
  return { event, idx };
}

function off({ event, idx }) {
  subscribers[event].splice(idx, 1);
}

export async function init() {
  let ethereum = window.ethereum;

  window.web3 = await Moralis.Web3.enable();

  ethereum.on('chainChanged', (chainId) => {
    subscribers['chainChanged'].forEach((f) => f(chainId))
  });
  ethereum.on('accountsChanged', (accounts) => {
    subscribers['accountsChanged'].forEach((f) => f(accounts))
  });

  isEthereumCompatible = true;
}

export function useWallet() {
  let ethereum = window.ethereum;

  async function connect() {
    // let requestedAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    // setAccounts(requestedAccounts);
  }



  const [chainId, setChainId] = useState(ethereum.chainId);
  const [currentAddress, setCurrentAddress] = useState(ethereum.selectedAddress);
  const { user, Moralis } = useMoralis();

  function setAccounts(accounts) {
    if (accounts && accounts.length > 0) {
      setCurrentAddress(accounts[0]);
    } else {
      setCurrentAddress(null);
    }
  }


  useEffect(() => {
    let isEffectDestroyed = false;
    async function handleAccountsChanged(accounts) {
      if (user) {
        // Check if the accounts are already linked ...
        const userAccounts = new Set(user.get('accounts'));
        const walletAccounts = accounts;
        const difference = walletAccounts.filter(x => !userAccounts.has(x));
        difference.forEach(async (unlinkedAccount) => {
          await Moralis.Web3.link(unlinkedAccount);
        })
      }
      if (!isEffectDestroyed) {
        setAccounts(accounts);
      }
    }

    async function handleChanIdChanged(chainId) {
      if (!isEffectDestroyed) {
        setChainId(chainId);
      }
    }

    window.ethereum.request({ method: 'eth_requestAccounts' }).then(handleAccountsChanged);
    window.ethereum.request({ method: 'eth_chainId' }).then(handleChanIdChanged);

    let chainChangedId = on('chainChanged', handleChanIdChanged);
    let accountsChangedId = on('accountsChanged', handleAccountsChanged);

    return () => {
      isEffectDestroyed = true;

      off(chainChangedId);
      off(accountsChangedId);
    }
  }, [true]);

  return { isEthereumCompatible, currentAddress, connect, chainId }
}
