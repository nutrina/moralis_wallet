import React, { useEffect } from 'react';
import { useMoralis } from "react-moralis";
import { getBalancesAsync, selectBalance } from './walletSlice';

import { useDispatch, useSelector } from 'react-redux';

export function Wallet() {
  const { user } = useMoralis();

  useEffect(() => {
    dispatch(getBalancesAsync({ accounts: user.get('accounts') }));
  }, [user])

  const dispatch = useDispatch();
  const balance = useSelector(selectBalance);
  function handleLoadBalance() {
    dispatch(getBalancesAsync({ accounts: user.get('accounts') }));
  }

  console.log("geri balance: ", balance);
  let balancesUi = null;

  balancesUi = balance.value.map((balance, idx) => {
    if (balance.status === "fulfilled") {
      let assets = null;
      const countShown = 3;
      const countNotShown = balance.value.assets.length - countShown;
      if (balance.value.assets.length > 0) {
        assets = balance.value.assets.slice(0, countShown).map((asset, aidx) => {
          return <div key={aidx}>
            ({asset.symbol}) {asset.name} {asset.balance}
          </div>
        })
      } else {
        assets = <div>No assets</div>;
      }
      const assetsNotShown = countNotShown <= 0 ? null : <div>Show {countNotShown} more assets.</div>;
      return <div key={idx}>
        <div>
          <h3>{balance.value.network}</h3>
        </div>
        {assets}
        {assetsNotShown}
      </div>;
    }
  })

  const progressIndicator = (balance.status === "loading") ? <div>Loading ...</div> : null;
  const error = (balance.status === "failed") ? <div>Failed to load balances</div> : null;

  return (
    <div>
      <button onClick={handleLoadBalance}>Refresh Balance</button>
      {progressIndicator}
      {error}
      {balancesUi}
    </div>
  );
}