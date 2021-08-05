import React from 'react';
import { useMoralis } from "react-moralis";
import { Text, Box, Flex, Button, Spinner, Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Wallet } from './features/wallet/Wallet';
import Header from './features/header/Header';



function App() {
  const { isAuthenticated, user, logout, isAuthenticating, isInitialized, authenticate } = useMoralis();
  let content = null;

  const handleLoginWithMetamask = () => {
    authenticate();
  }

  if (!window.ethereum) {
    content = <Box p="2">
      <Text fontSize="xl" align="center"> You need to use supported browser like 
        <Link href="https://chrome.google.com/" isExternal> Chrome <ExternalLinkIcon mx="2px" /> </Link> 
        or 
        <Link href="https://brave.com/" isExternal> Brave <ExternalLinkIcon mx="2px" /> </Link> 
        and install a Web3 Wallet like
        <Link href="https://metamask.io" isExternal> Metamask <ExternalLinkIcon mx="2px" /> </Link>
      </Text >
    </Box >
  } else if (!isInitialized || isAuthenticating) {
    content = <Box p="2">
      <Text align="center"> Please wait, we are authentication you ... </Text>
      <Flex justify="center"><Spinner /></Flex>
    </Box>
  } else {
    let authenticationButton = null;
    if (!isAuthenticated) {
      authenticationButton =
        <Flex align="center"
          p="2"
          justify="center"
          wrap="wrap">
          <Button size="lg" onClick={handleLoginWithMetamask}>Login with Metamask</Button>
        </Flex>
    }

    content = <Box p="4">
      {authenticationButton}
      <Wallet />
    </Box>
  }

  return (
    <>
      <Header />
      {content}
    </>
  );
}

export default App;
