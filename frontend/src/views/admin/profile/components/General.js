// Chakra imports
import { SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React from "react";
import Information from "views/admin/profile/components/Information";
import Info from "./Info";
import Info2 from "./Info2";

// Assets
// contact={currentCustomer.mobile}
//           address={currentCustomer.address}
//           email={currentCustomer.email}
//           gst={currentCustomer.GSTIN}
export default function GeneralInformation(props) {
  const { contact, address, email, gst, orderTotal, paymentsTotal, currentStatus, status, ...rest } = props;

  const gradient = `linear-gradient(60deg, #6a11cb 0%, #2575fc 100%)`;

  const bg = useColorModeValue(gradient);
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
      <SimpleGrid columns="2" gap="20px">
        <Information
          boxShadow={cardShadow}
          title1="Phone No"
          value1={`+91 ${contact}`}
          title2="Email"
          value2={email ?? "-"}
          bg={bg}
        />
        <Information
          boxShadow={cardShadow}
          title2="Address"
          value2={address}
          title1="GSTIN"
          value1={gst}
          bg={bg}
        />
      </SimpleGrid>
      <SimpleGrid columns="3" mt={'1rem'} gap="20px">
        <Info
          boxShadow={cardShadow}
          title="Order Total"
          value={orderTotal}
          bg={'red.500'}
          color={'white'}
        />
        <Info
          boxShadow={cardShadow}
          title="Payments Received"
          value={paymentsTotal}
          bg={'green.500'}
          color={'white'}
          
        />
        <Info2
          boxShadow={cardShadow}
          title="Current Status"
          value={currentStatus}
          bg={'white'}
          color={status? 'green':'red'}
        />
      </SimpleGrid>
    </Card>
  );
}
