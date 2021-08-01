import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { Box, Spinner, Text, Spacer, Flex, Progress } from "@chakra-ui/react"
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from "@chakra-ui/react"

import { getBalancesAsync, selectBalance } from './walletSlice';


export function Wallet() {
  const { isAuthenticated, user } = useMoralis();

  useEffect(() => {
    console.log("geri user", user);
    console.log("geri isAuthenticated", isAuthenticated);
    if (isAuthenticated && user) {
      dispatch(getBalancesAsync({ accounts: user.get('accounts') }));
    }
  }, [isAuthenticated])

  const dispatch = useDispatch();
  const balance = useSelector(selectBalance);
  console.log("geri wallet balance", balance);

  const balancesUi = balance.value.map((chainBalance, idx) => {
    if (chainBalance.status === "fulfilled") {
      let assets = null;
      if (chainBalance.value.assets.length > 0) {
        const rows = chainBalance.value.assets.map((asset, aidx) => {
          return <Tr key={aidx}>
            <Td>{asset.symbol}</Td>
            <Td>{asset.name}</Td>
            <Td isNumeric>{ethers.utils.formatUnits(asset.balance, asset.decimals)}</Td>
          </Tr>
        });

        assets = <Table variant="simple" size="sm" borderRadius={5}>
          <Thead>
            <Tr>
              <Th>Symbol</Th>
              <Th>Name</Th>
              <Th isNumeric>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows}
          </Tbody>
        </Table>
      } else {
        assets = <Text>You do not have any assets yet.</Text>
      }

      const progressIndicator = (balance.status === "loading") ? <Spinner /> : null;
      return <Box key={idx} boxShadow="base" p="6" rounded="md">
        <Flex>
          <Text fontSize="2xl">{chainBalance.value.network} {}</Text>
          <Spacer />
          {progressIndicator}
        </Flex>
          {assets}
      </Box>;
    }
  })

  const progressIndicator = (balance.status === "loading" && balancesUi.length === 0 ) ? <Flex justify="center"><Progress w="100%" size="sm" isIndeterminate/></Flex> : null;
  const error = (balance.status === "failed") ? <Text>Failed to load balances</Text> : null;

  return (
    <div>
      {progressIndicator}
      {error}
      {balancesUi}
    </div>
  );
}