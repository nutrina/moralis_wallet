import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { Box, Spinner, Text, Spacer, Flex, Progress, useColorModeValue } from "@chakra-ui/react"
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from "@chakra-ui/react"

import { getBalancesAsync, selectBalance, selectNetworks, selectPrices } from './walletSlice';


export function Wallet() {
  const { isAuthenticated, user } = useMoralis();
  const backgroundColor = useColorModeValue("rgb(255,255,255)", "rgba(255,255,255,0.01)");

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(getBalancesAsync({ accounts: user.get('accounts') }));
    }
  }, [isAuthenticated])

  const dispatch = useDispatch();
  const balance = useSelector(selectBalance);
  const networks = useSelector(selectNetworks);
  const prices = useSelector(selectPrices);
  let totalUSD = 0;

  const balancesUi = networks.map((network, idx) => {
    const chainBalance = balance.value[network.network];
    let assets = null;
    let progressIndicator = null;
    if (chainBalance && chainBalance.status === "fulfilled") {
      if (chainBalance.value.assets.length > 0) {
        const rows = chainBalance.value.assets.map((asset, aidx) => {
          const price = prices[network.network][asset.token_address];
          const amount = ethers.utils.formatUnits(asset.balance, asset.decimals);
          const usdPrice = price ? price.usdPrice : 0;
          const amountNumber = Number.parseFloat(amount);
          const value = amountNumber * usdPrice;
          totalUSD += value;
          return <Tr key={aidx}>
            <Td>{asset.symbol}</Td>
            <Td>{asset.name}</Td>
            <Td isNumeric>{amount}</Td>
            <Td isNumeric>{price ? <Text whiteSpace="nowrap">{"$ " + usdPrice}</Text> : "?"}</Td>
            <Td isNumeric>{price ? <Text whiteSpace="nowrap">{"$ " + value}</Text> : "?"}</Td>
          </Tr>
        });

        assets = <Table variant="simple" size="sm" borderRadius={5}>
          <Thead>
            <Tr>
              <Th>Symbol</Th>
              <Th>Name</Th>
              <Th isNumeric>Amount</Th>
              <Th isNumeric>Price</Th>
              <Th isNumeric>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows}
          </Tbody>
        </Table>
      } else {
        assets = <Text>You do not have any assets yet.</Text>
      }
    }

    progressIndicator = (balance.status === "loading") ? <Spinner /> : null;


    return <Box key={idx}
      boxShadow="md"
      p="6"
      marginTop="10"
      rounded="md"
      border="1px"
      borderColor="gray.200"
      backgroundColor={backgroundColor}
    >
      <Flex>
        <Text fontSize="2xl">{network.displayName} { }</Text>
        <Spacer />
        {progressIndicator}
      </Flex>
      {assets}
    </Box>;
  });

  const progressIndicator = (balance.status === "loading" && balancesUi.length === 0) ? <Flex justify="center"><Progress w="100%" size="sm" isIndeterminate /></Flex> : null;
  const error = (balance.status === "failed") ? <Text>Failed to load balances</Text> : null;

  return (
    <div>
      <Flex align="center"
        p="2"
        justify="center"
        wrap="wrap">
        <Text fontSize="5xl" >$ {totalUSD} </Text>
      </Flex>
      {progressIndicator}
      {error}
      {balancesUi}
    </div>
  );
}