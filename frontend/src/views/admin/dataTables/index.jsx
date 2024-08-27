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
  CircularProgress,
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
  const history = useHistory();
  const [customerData, setCustomerData] = useState([]);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCustomers()
      .then(() => {
        console.log('');
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        alert('Something Went wrong');
      });
  }, []);

  const handleRetry = () => {
    getCustomers();
  };

  async function getCustomers() {
    try {
      const response = await axios.get('http://localhost:5000/api/getRequiredDataCustomers');
      const d = response.data;
      console.log(d);
      setCustomerData(d);
      setError(null);
    } catch (error) {
      console.error('Error adding customer:', error);
      setError('Oops! Something went wrong. Please try again later.');
    }
  }

  const handleAddCustomer = () => {
    history.push({
      pathname: `/admin/customers/addCustomer`,
    });
  };

  const textColor = useColorModeValue("secondaryGray.900", "white");

  const handleViewButtonClick = (data) => {
    const custId = data.id;
    history.push({
      pathname: `/admin/customers/profile/${custId}`,
      state: { id: custId },
    });
  };

  const [isOpen, setIsOpen] = useState(false);
  const [custId, setCustId] = useState(-1);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();

  async function deleteCustomer(id) {
    try {
      const response = await axios.delete(`http://localhost:5000/api/deleteCustomer/${id}`);
      setAlert({ message: "Customer deleted successfully!", type: "success" });
      setTimeout(() => {
        setAlert({});
      }, 2500);
    } catch (error) {
      setError('Oops! Something went wrong. Please try again later.');
      setAlert({ message: error.message, type: "error" });
      setTimeout(() => {
        setAlert({});
      }, 3000);
    }
  }

  const handleDelClick = (data) => {
    setCustId(data.id);
    setIsOpen(true);
  }

  const handleEditClick = (data) => {
    const custId = data.id;
    history.push({
      pathname: `/admin/customers/edit/${custId}`,
      state: { id: custId },
    });
  }

  const handleDeleteConfirmed = () => {
    deleteCustomer(custId).then(() => {
      console.log("customer deleted!");
      getCustomers().then(() => { console.log(''); })
    });
    setCustId(-1);
    onClose();
  };

  return (
    <>
      {loading ? (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="rgba(255, 255, 255, 0.8)"
          zIndex="9999"
        >
          <CircularProgress isIndeterminate color="blue.500" />
        </Box>
      ) : (
        <>
          {error ? (
            <Error errorMessage={error} onRetry={handleRetry} />
          ) : (
            <>
              <Box>
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
                  handleEditClick={handleEditClick}
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
          )}
        </>
      )}
    </>
  );
}
