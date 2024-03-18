// chakra imports
import { Box, Flex, Stack } from "@chakra-ui/react";
//   Custom components
import Brand from "components/sidebar/components/Brand";
import Links from "components/sidebar/components/Links";
import SidebarCard from "components/sidebar/components/SidebarCard";
import React from "react";

// FUNCTIONS

function SidebarContent(props) {
  const { routes } = props;
  // const bg = 'linear-gradient(0deg, #accbee 0%, #e7f0fd 100%)'
  const bg = 'linear-gradient(45deg, #93a5cf 0%, #e4efe9 100%)'
  // SIDEBAR
  return (
    <Flex direction='column' height='100%' pt='25px' px="16px" bg={bg}  >
      <Brand />
      <Stack direction='column' mb='auto' mt='8px'>
        
        <Box pe={{ md: "16px", "2xl": "1px" }}>
          <Links routes={routes} />
        </Box>
      </Stack>

      <Box
        mt='60px'
        mb='40px'
        borderRadius='30px'>
        {/* <SidebarCard /> */}
      </Box>
    </Flex>
  );
}

export default SidebarContent;
