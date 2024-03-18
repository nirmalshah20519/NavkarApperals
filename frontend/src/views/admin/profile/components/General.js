// Chakra imports
import { SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React from "react";
import Information from "views/admin/profile/components/Information";

// Assets
// contact={currentCustomer.mobile}
//           address={currentCustomer.address}
//           email={currentCustomer.email}
//           gst={currentCustomer.GSTIN}
export default function GeneralInformation(props) {
  const { contact, address, email, gst, ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );
  return (
    <Card mb={{ base: "0px", "2xl": "20px" }} {...rest}>
      {/* <Text
        color={textColorPrimary}
        fontWeight='bold'
        fontSize='2xl'
        mt='10px'
        mb='4px'>
        General Information
      </Text>
      <Text color={textColorSecondary} fontSize='md' me='26px' mb='40px'>
        As we live, our hearts turn colder. Cause pain is what we go through as
        we become older. We get insulted by others, lose trust for those others.
        We get back stabbed by friends. It becomes harder for us to give others
        a hand. We get our heart broken by people we love, even that we give
        them all...
      </Text> */}
      <SimpleGrid columns='2' gap='20px'>
        <Information
          boxShadow={cardShadow}
          title='Phone No'
          value={`+91 ${contact}`}
        />
        <Information
          boxShadow={cardShadow}
          title='Email'
          value={email??'-'}
        />
        <Information
          boxShadow={cardShadow}
          title='Address'
          value={address}
        />
        <Information
          boxShadow={cardShadow}
          title='GSTIN'
          value={gst}
        />
        {/* <Information
          boxShadow={cardShadow}
          title='Organization'
          value='Simmmple Web LLC'
        />
        <Information
          boxShadow={cardShadow}
          title='Birthday'
          value='20 July 1986'
        /> */}
      </SimpleGrid>
    </Card>
  );
}
