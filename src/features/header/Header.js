import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Heading,
  Flex,
  Button,
  Image,
  useDisclosure,
  useColorMode,
  Link,
  Icon,
  IconButton
} from "@chakra-ui/react";
import { HamburgerIcon, SunIcon, MoonIcon } from "@chakra-ui/icons";
import { useMoralis } from "react-moralis";
import { getBalancesAsync, reset as resetWallet, selectBalance } from '../wallet/walletSlice';
import logo from '../../moralis/Powered-by-Moralis-Badge-Green.svg';

import { FaGithub } from "react-icons/fa";

// Note: This code could be better,
// so I'd recommend you to understand how I solved and you could write yours better :)
// Good luck! 🍀

// Update: Check these awesome headers from Choc UI 👇
// https://choc-ui.tech/docs/elements/headers
const Header = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const { user, logout, isAuthenticated } = useMoralis();
  const dispatch = useDispatch();
  const handleToggle = () => (isOpen ? onClose() : onOpen());
  const ColorModeToggleIcon = colorMode === "light" ? MoonIcon : SunIcon;
  const balance = useSelector(selectBalance);

  function handleLoadBalance() {
    dispatch(getBalancesAsync({ accounts: user.get('accounts') }));
  }

  function handleLogout() {
    logout();
    dispatch(resetWallet());
  }

  const logoutButton = isAuthenticated ? <Button
    variant="outline"
    m={1}
    onClick={handleLogout}
  >
    Logout
  </Button> : null;

  const refreshButton = isAuthenticated ? <Button
    variant="outline"
    m={1}
    onClick={handleLoadBalance}
    isLoading={balance.status === "loading"}
  >
    Refresh Balance
  </Button> : null;

  const gitHub = <Link href="https://github.com/nutrina/moralis_wallet" isExternal variant="outline" m={4}>
    <Icon as={FaGithub}></Icon>
  </Link>;


  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={3}
      {...props}
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="lg" letterSpacing={"tighter"}>
          Crypto Wallet
        </Heading>
        <Image src={logo} paddingLeft="5" />
      </Flex>

      <Box display={{ base: "block", md: "none" }} onClick={handleToggle}>
        <HamburgerIcon />
      </Box>

      <Box
        display={{ base: isOpen ? "block" : "none", md: "block" }}
        mt={{ base: 4, md: 0 }}
      >
        <ColorModeToggleIcon onClick={toggleColorMode} m={1} />
        {gitHub}
        {refreshButton}
        {logoutButton}
      </Box>
    </Flex>
  );
};

export default Header;
