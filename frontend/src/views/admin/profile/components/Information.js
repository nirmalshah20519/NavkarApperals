// Chakra imports
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React from "react";

export default function Information(props) {
  const { title1, value1, title2, value2, bg, ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("white");
  const textColorSecondary = "gray.400";
  const gradient = `linear-gradient(60deg, #6a11cb 0%, #2575fc 100%)`;
  const gradientRev = `linear-gradient(-60deg, #6a11cb 0%, #2575fc 100%)`;
  
  const bgRev = useColorModeValue(gradientRev);
  return (
    <Card bg={bg} {...rest}>
      <Box>
        <Text fontWeight="500" color={textColorPrimary} fontSize="sm">
          {title1}
        </Text>
        <Text color={textColorSecondary} fontWeight="500" fontSize="md">
          {value1}
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
