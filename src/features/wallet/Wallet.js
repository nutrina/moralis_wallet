import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { Heading, UnorderedList, ListItem, Text, Box } from "@chakra-ui/react"
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react"

import { getBalancesAsync, selectBalance } from './walletSlice';


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
      if (balance.value.assets.length > 0) {
        assets = balance.value.assets.map((asset, aidx) => {
          return <Tr key={aidx}>
            <Td>{asset.symbol}</Td>
            <Td>{asset.name}</Td>
            <Td isNumeric>{ethers.utils.formatUnits(asset.balance, asset.decimals)}</Td>
          </Tr>
        })
      } else {
        assets = <div>No assets</div>;
      }

      return <Box key={idx} m={5} boxShadow="lg" p="6" rounded="md">
        <Heading fontSize="2xl">{balance.value.network}</Heading>
        <Table variant="simple" size="sm" borderRadius={5}>
          <Thead>
            <Tr>
              <Th>Symbol</Th>
              <Th>Name</Th>
              <Th isNumeric>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {assets}
          </Tbody>
        </Table>
      </Box>;
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