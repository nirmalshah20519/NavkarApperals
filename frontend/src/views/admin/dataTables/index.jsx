/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import {
  Box,
  Flex,
  Text,
  Button,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import DevelopmentTable from "views/admin/dataTables/components/DevelopmentTable";
import CheckTable from "views/admin/dataTables/components/CheckTable";
import ColumnsTable from "views/admin/dataTables/components/ColumnsTable";
import ComplexTable from "views/admin/dataTables/components/ComplexTable";
import {
  columnsDataDevelopment,
  columnsDataCheck,
  columnsDataColumns,
  columnsDataComplex,
} from "views/admin/dataTables/variables/columnsData";

// import {CustomerDetailData} from "views/admin/profile/variables/CustomerDetail.json"
import tableDataDevelopment from "views/admin/dataTables/variables/tableDataDevelopment.json";
import tableDataCheck from "views/admin/dataTables/variables/tableDataCheck.json";
import tableDataColumns from "views/admin/dataTables/variables/tableDataColumns.json";
import tableDataComplex from "views/admin/dataTables/variables/tableDataComplex.json";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  useHistory,
} from "react-router-dom";
import axios, * as others from 'axios';

import Error from "../default/components/Error";


export default function Settings() {
  // console.log(tableDataColumns);
  const history = useHistory();
  const [customerData, setCustomerData] = useState([])

  const [alert, setAlert] = useState({ message: "", type: "" });

  const [error, setError] = useState(false);

  useEffect(() => {
    getCustomers().then(()=>{console.log('');})
  },[])

  const handleRetry = () => {
    // Retry logic, you can make an API call or perform any necessary action here
    getCustomers();
  };

  async function getCustomers() {
    // const axios = require('axios');
    // setIsSubmitting(true);

    try {
        const response = await axios.get('http://localhost:5000/api/getRequiredDataCustomers');
        // console.log(response.data);
        const d = response.data
        console.log(d);
        setCustomerData(d)
        setError(null)
        
        // setIsSubmitting(false);
    } catch (error) {
        console.error('Error adding customer:', error);
        setError('Oops! Something went wrong. Please try again later.');
        // setIsSubmitting(false);
    }
}



  const handleAddCustomer = () => {
    history.push({
      pathname: `/admin/data-tables/addCustomer`,
    });
  };

  const textColor = useColorModeValue("secondaryGray.900", "white");
  // console.log("HERE",history);
  const handleViewButtonClick = (data) => {
    // Navigate to the profile route with props
    const custId = data.id;
    // console.log(CustomerDetailData);

    history.push({
      pathname: `/admin/data-tables/profile/${custId}`,
      state: { id: custId },
    });
  };

  // async function deleteCustomer(id){
  //   try{

  //   }
  //   catch{

  //   }
  // }

  

  const [isOpen, setIsOpen] = useState(false);
  const [custId, setCustId] = useState(-1);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  async function deleteCustomer(id) {
    // const axios = require('axios');
    // setIsSubmitting(true);

    try {
        const response = await axios.delete(`http://localhost:5000/api/deleteCustomer/${id}`);
        // console.log(response.data);
        setAlert({ message: "Customer deleted successfully!", type: "success" }); // Setting success message
        const  timer = setTimeout(() => {setAlert({});}, 2500); // Clearing alert after
        

        
        // setIsSubmitting(false);
    } catch (error) {
        setError('Oops! Something went wrong. Please try again later.');
        // setIsSubmitting(false);
        setAlert({ message: error.message, type: "error" }); // Setting success message
        const  timer = setTimeout(() => {setAlert({});}, 3000); // Clearing alert after
    }
}


  const handleDelClick = (data) =>{
    setCustId(data.id);
    // console.log(custId);

    setIsOpen(true);
  }

  const handleDeleteConfirmed = () => {
    console.log(custId);
    // Perform deletion logic here
    deleteCustomer(custId).then(()=>{
      console.log("customer deleted!");
      getCustomers().then(()=>{console.log('');})
    })
    setCustId(-1)
    onClose(); // Close the confirmation dialog
  };


  // Chakra Color Mode
  return (
    <>
    {
      error ? (
        <Error errorMessage={error} onRetry={handleRetry} />
      ):(
        <>
        <Box>
      {/* <SimpleGrid
        mb='20px'
        columns={{ sm: 1, md: 2 }}
        spacing={{ base: "20px", xl: "20px" }}>
        <DevelopmentTable
          columnsData={columnsDataDevelopment}
          tableData={tableDataDevelopment}
        />
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
        
        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
      </SimpleGrid> */}
      <Flex px="25px" py={'16px'} borderRadius={'16px'} justify="space-between" mb="20px" align="center" bg={'white'}>
        <Text
          color={textColor}
          fontSize="2rem"
          fontWeight="700"
          lineHeight="100%"
        >
          Customers
        </Text>
        <Button colorScheme="blue" onClick={handleAddCustomer}>
          Add Customers
        </Button>
      </Flex>
      <ColumnsTable
        columnsData={columnsDataColumns}
        tableData={customerData}
        handleClick={handleViewButtonClick}
        handleDelClick={handleDelClick}
      />
      {alert.message && (
        <Alert status={alert.type} mt="4">
          <AlertIcon />
          {alert.message}
        </Alert>
      )}
    </Box>


    <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Deletion
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this customer?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteConfirmed} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
</>
    
      )
    }


    </>
    
  );
}
