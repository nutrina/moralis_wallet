import React from 'react';
import { useMoralis } from "react-moralis";
import { Heading, UnorderedList, ListItem, Text, Box, Image, Flex, Button } from "@chakra-ui/react";
import { Counter } from './features/counter/Counter';
import { Wallet } from './features/wallet/Wallet';
import Header from './Header';



function App() {
  const { Moralis, isAuthenticated, user, logout, isAuthenticating, isInitialized, authenticate } = useMoralis();

  const handleLoginWithMetamask = () => {
    authenticate();
  }

  if (!isInitialized || isAuthenticating) {
    return <div> Please wait, we are authentication you ... </div>
  }

  let authenticationButton = null;
  let userInfo = null;

  if (!isAuthenticated) {
    authenticationButton = <button onClick={handleLoginWithMetamask}>Login with Metamask</button>
  } else {
    userInfo = <div>
      You are logged in as: {user.get('username')}
    </div>
  }

  console.log("User accounts: ", user.get("accounts"))
  return (
    <>
      <Header />
      <Box>
        <Flex align="center"
          p="2"
          justify="center"
          wrap="wrap">
          <Text fontSize="5xl" >123.46 ETH</Text>
        </Flex>
        
        {authenticationButton}
        {userInfo}
        Here are your balances:
        <Wallet />
      </Box>
    </>
  );
}

export default App;
