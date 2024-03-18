import React from "react";

// Chakra imports
import { Flex,Image, useColorModeValue } from "@chakra-ui/react";
import logo from 'assets/img/avatars/navkarLogo.png'

// Custom components
import { HorizonLogo } from "components/icons/Icons";
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='left' direction='column'>
      {/* <HorizonLogo h='26px' w='175px' my='32px' color={logoColor} /> */}
      {/* <Text fontSize='4xl' fontWeight='bold' color='primaryColor'>
      Navkar
    </Text> */}
    <Image src={logo} alt='Logo' w={'150px'} mx={'auto'} />
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
