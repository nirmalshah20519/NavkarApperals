// Chakra imports
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React from "react";

export default function Info2(props) {
  const { title, value, bg, text, ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("white");
  const textColorSecondary = "gray.400";
  const gradient = `linear-gradient(60deg, #6a11cb 0%, #2575fc 100%)`;
  const gradientRev = `linear-gradient(-60deg, #6a11cb 0%, #2575fc 100%)`;
  
  const bgRev = useColorModeValue(gradientRev);
  return (
    <Card bg={bg} {...rest}>
      <Box>
        <Text fontWeight="900" fontSize="lg" color={'black'}>
          {title}
        </Text>
        <Text fontWeight="300" fontSize="2.5rem">
          {value}
        </Text>
        {/* <Text fontWeight="500" color={textColorPrimary} fontSize="sm">
          {title2}
        </Text>
        <Text color={textColorSecondary} fontWeight="500" fontSize="md">
          {value2}
        </Text> */}
      </Box>
    </Card>
  );
}
