import React from "react";
import {
  Box,
  Stack,
  Heading,
  Flex,
  Text,
  Button,
  Image,
  useDisclosure,
  useColorMode,
  Icon
} from "@chakra-ui/react";
import { HamburgerIcon, SunIcon, MoonIcon } from "@chakra-ui/icons";
import logo from './moralis/Powered-by-Moralis-Badge-Green.svg';

// Note: This code could be better,
// so I'd recommend you to understand how I solved and you could write yours better :)
// Good luck! 🍀

// Update: Check these awesome headers from Choc UI 👇
// https://choc-ui.tech/docs/elements/headers
const Header = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const handleToggle = () => (isOpen ? onClose() : onOpen());
  const ColorModeToggleIcon = colorMode === "light" ? MoonIcon : SunIcon;

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
        <ColorModeToggleIcon onClick={toggleColorMode} m={1}/>
        <Button
          variant="outline"
          m={1}
        >
          Logout
        </Button>
        <Button
          variant="outline"
          m={1}
        >
          Refresh
        </Button>
      </Box>
    </Flex>
  );
};

export default Header;
