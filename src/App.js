import React from 'react';
import { useMoralis } from "react-moralis";
import { Heading, UnorderedList, Progress, Text, Box, Image, Flex, Button, useColorModeValue, Spinner } from "@chakra-ui/react";
import { Wallet } from './features/wallet/Wallet';
import Header from './features/header/Header';



function App() {
  const { isAuthenticated, user, logout, isAuthenticating, isInitialized, authenticate } = useMoralis();
  let content = null;
  // const bg = useColorModeValue("gray.50");

  const handleLoginWithMetamask = () => {
    authenticate();
  }

  if (!isInitialized || isAuthenticating) {
    content = <Box p="2">
      <Text align="center"> Please wait, we are authentication you ... </Text>
      <Flex justify="center"><Spinner /></Flex>
    </Box>

  }
  else {
    let authenticationButton = null;
    let userInfo = null;

    if (!isAuthenticated) {
      authenticationButton =
        <Flex align="center"
          p="2"
          justify="center"
          wrap="wrap">
          <Button size="lg" onClick={handleLoginWithMetamask}>Login with Metamask</Button>
        </Flex>
    } else {
      userInfo = <div>
        You are logged in as: {user.get('username')}
      </div>
    }

    const totalBalance = isAuthenticated ? <Flex align="center"
      p="2"
      justify="center"
      wrap="wrap">
      <Text fontSize="5xl" >123.46 ETH</Text>
    </Flex> : null;

    content = <Box p="2">
      {totalBalance}
      {authenticationButton}
      {userInfo}
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
