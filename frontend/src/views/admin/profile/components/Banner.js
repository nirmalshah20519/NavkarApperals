// Chakra imports
import { Avatar, Box, Button, Text, useColorModeValue } from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React from "react";
import { useHistory } from 'react-router-dom';

export default function Banner(props) {
  const { banner, avatar, name, job, id } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const borderColor = useColorModeValue(
    "white !important",
    "#111C44 !important"
  );
  return (
    <Card mb={{ base: "0px", lg: "20px" }} align='center' w={{base:'96%', md:'30%'}} mx={'auto'}>
      <Box
        bg={`url(${banner})`}
        bgSize='cover'
        borderRadius='16px'
        // h='210px'
        minH={'116px'}
        w='100%'
      />
      <Avatar
        mx='auto'
        src={avatar}
        h='96px'
        w='96px'
        mt='-43px'
        border='4px solid'
        borderColor={borderColor}
      />
      <Text color={textColorPrimary} fontWeight='bold' fontSize='xl' mt='10px'>
        {name}
      </Text>
      <Text color={textColorSecondary} fontSize='sm'>
        {job}
      </Text>
    </Card>
  );
}
