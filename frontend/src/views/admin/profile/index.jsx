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
  Button,
  Flex,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";

// Custom components
import Banner from "views/admin/profile/components/Banner";
import General from "views/admin/profile/components/General";
import Notifications from "views/admin/profile/components/Notifications";
import Projects from "views/admin/profile/components/Projects";
import Storage from "views/admin/profile/components/Storage";
import Upload from "views/admin/profile/components/Upload";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useHistory, useLocation } from "react-router-dom";
// import  customerDetails  from 'views/admin/profile/variables/CustomerDetail.json';
import BillDetails from "views/admin/profile/variables/BillDetails.json";

// Assets
import avatar from "assets/img/avatars/customer.jpg";
import banner from "assets/img/auth/banner.png";
import React, { useEffect, useState } from "react";
import {
  columnsDataLedger,
  columnsDataPayments,
  columnsDataTransactions,
} from "./variables/ColumnData";
import ColumnsTable from "views/admin/profile/components/ColumnsTable";
import axios, * as others from "axios";
import ColumnsTablePayments from "./components/ColumnsTablePayments";
import ColumnsTableLedger from "./components/ColumnsTableLedger";

export default function Overview() {
  // console.log(customerDetails);
  // console.log(customerDetails);
  // console.log("HERERERERE");

  const [customerData, setCustomerData] = useState([]);
  const [customerPaymentData, setCustomerPaymentData] = useState([]);
  const [customer, setCustomer] = useState({});

  const [orderTotal, setOrderTotal] = useState(0);
  const [paymentsTotal, setPaymentsTotal] = useState(0);

  const [alert, setAlert] = useState({ message: "", type: "" });

  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getCustomers().then((d) => {
      // console.log("loaded..",d);
      setOrderTotal(0);
      d.transactions.forEach((e) => setOrderTotal((o) => o + Number(e.amount)));
      // console.log(orderTotal);

      setPaymentsTotal(0);
      d.payments.forEach((e) => setPaymentsTotal((o) => o + Number(e.Amount)));
      // console.log(paymentsTotal);
    });
  }, []);

  async function getCustomers() {
    // const axios = require('axios');
    // setIsSubmitting(true);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/getRequiredDataCustomersById/${id}`
      );
      const d = response.data;
      setCustomer(d);
      return d;
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  }

  const textColor = useColorModeValue("secondaryGray.900", "white");

  const location = useLocation();
  // debugger;
  // console.log("yyyy");
  // console.log(location.state);

  // const {id } = location.state;
  const { id } = useParams();
  // console.log("id",id);
  // const {id} = {id:1};
  // console.log(id);
  // console.log(customerDetails);

  // console.log(someProp, id);
  const history = useHistory();

  const handleAddTransaction = () => {
    // console.log(id);
    history.push({
      pathname: `/admin/customers/profile/${customer.id}/addTransaction`,
      state: { id: customer.id },
    });
  };

  const handleAddPayment = () => {
    history.push({
      pathname: `/admin/customers/profile/${customer.id}/addPayment`,
      state: { id: customer.id },
    });
  };

  const handleViewTransaction = (tid) => {
    history.push({
      pathname: `/admin/customers/profile/${customer.id}/Transaction/${tid}`,
      state: { id: customer, tid: tid },
    });
  };

  const handleGoBack = () => {
    history.push({
      pathname: `/admin/customers/`,
      // state: { id: currentCustomer.id }
    });
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isPyOpen, setPyIsOpen] = useState(false);
  const [ordId, setOrdId] = useState(-1);
  const [pyId, setpyId] = useState(-1);
  const onClose = () => setIsOpen(false);
  const onPyClose = () => setPyIsOpen(false);
  const cancelRef = React.useRef();

  async function deleteOrder(id) {
    // const axios = require('axios');
    // setIsSubmitting(true);

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/deleteOrder/${id}`
      );
      // console.log(response.data);
      setAlert({ message: "order deleted successfully!", type: "success" }); // Setting success message
      const timer = setTimeout(() => {
        setAlert({});
      }, 2500); // Clearing alert after

      // setIsSubmitting(false);
    } catch (error) {
      setError("Oops! Something went wrong. Please try again later.");
      // setIsSubmitting(false);
      setAlert({ message: error.message, type: "error" }); // Setting success message
      const timer = setTimeout(() => {
        setAlert({});
      }, 3000); // Clearing alert after
    }
  }

  async function deletePayment(id) {
    // const axios = require('axios');
    // setIsSubmitting(true);

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/deleteTransaction/${id}`
      );
      // console.log(response.data);
      setAlert({
        message: "Transaction deleted successfully!",
        type: "success",
      }); // Setting success message
      const timer = setTimeout(() => {
        setAlert({});
      }, 2500); // Clearing alert after
      getCustomers().then(() => {
        console.log("donr");
      });

      // setIsSubmitting(false);
    } catch (error) {
      setError("Oops! Something went wrong. Please try again later.");
      // setIsSubmitting(false);
      setAlert({ message: error.message, type: "error" }); // Setting success message
      const timer = setTimeout(() => {
        setAlert({});
      }, 3000); // Clearing alert after
    }
  }

  const handleDelClick = (id) => {
    setOrdId(id);
    console.log(id);

    setIsOpen(true);
  };

  const handlePayDelClick = (id) => {
    console.log(id);
    setpyId(id);
    setPyIsOpen(true);
  };

  const handleDeleteConfirmed = () => {
    console.log(ordId);
    // Perform deletion logic here
    deleteOrder(ordId).then(() => {
      console.log("Order deleted!");
      getCustomers().then(() => {
        console.log("");
      });
    });
    setOrdId(-1);
    onClose(); // Close the confirmation dialog
  };

  async function getLedger() {
    // const axios = require('axios');
    // setIsSubmitting(true);
    console.log(id);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/printLedger/${id}`
      );
      return response.data;

      // setIsSubmitting(false);
    } catch (error) {
      setError("Oops! Something went wrong. Please try again later.");
      // setIsSubmitting(false);
      setAlert({ message: error.message, type: "error" }); // Setting success message
      const timer = setTimeout(() => {
        setAlert({});
      }, 3000); // Clearing alert after
    }
  }

  const handlePrint = () => {
    setIsLoading(true); // Start loading
    getLedger().then((d) => {
      // console.log(d);
      setIsLoading(false); // Start loading
      const printWindow = window.open("", "_blank");
      printWindow.document.open();
      printWindow.document.write(d); // Assuming d contains the HTML content you want to print
      printWindow.document.close();
      const time = setTimeout(() => {
        printWindow.print();
      }, 50);
    });
  };

  const handlePyDeleteConfirmed = () => {
    deletePayment(pyId).then((data) => {
      if (!data) {
        setAlert({ message: "Failed to Delete Payment.", type: "error" });
      } else {
        setAlert({ message: `Successfully Deleted Payment.`, type: "success" });
      }
    });
    setpyId(-1);
    onPyClose();
  };

  const formatIndianCurrency = (num) => {
    // Convert number to string
    let strNum = num.toString();

    // Separate integer part from decimal part if present
    let parts = strNum.split(".");
    let integerPart = parts[0];
    let decimalPart = parts.length > 1 ? "." + parts[1] : "";

    // Add commas to integer part
    let formattedIntegerPart = "";
    for (let i = integerPart.length - 1, j = 0; i >= 0; i--, j++) {
      if (j > 0 && j % 3 === 0) {
        formattedIntegerPart = "," + formattedIntegerPart;
      }
      formattedIntegerPart = integerPart[i] + formattedIntegerPart;
    }

    // Return the formatted number
    return "₹ " + formattedIntegerPart + decimalPart;
  };

  // const orderTotal = customer.transactions

  return (
    <Box>
      {/* Main Fields */}

      {/* Back Button    */}
      <Text
        fontSize={"1.5rem"}
        background={"transparent"}
        cursor={"pointer"}
        _hover={{ color: "blue" }}
        // variant="solid"
        onClick={handleGoBack}
      >
        <ArrowBackIcon />
      </Text>

      <Flex
        direction={{ base: "column", lg: "row" }}
        justify="space-between"
        align={{ base: "flex-start" }}
        gap={{ base: "20px", lg: "20px" }}
      >
        <Banner
          banner={banner}
          avatar={avatar}
          name={customer.name}
          job={customer.type}
          id={customer.id}
        />
        {/* {console.log(currentCustomer)} */}

        <General
          gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
          // minH="250px"
          pe="20px"
          contact={customer.mobile}
          address={customer.address}
          email={customer.email}
          gst={customer.GSTIN}
          orderTotal={formatIndianCurrency(orderTotal)}
          paymentsTotal={formatIndianCurrency(paymentsTotal)}
          currentStatus={formatIndianCurrency(paymentsTotal - orderTotal)}
          status={paymentsTotal - orderTotal > 0}
        />

        {/* <Storage
    used={25.6}
    total={50}
  />
  <Upload
    minH={{ base: "auto", lg: "420px", "2xl": "365px" }}
    pe='20px'
    pb={{ base: "100px", lg: "20px" }}
  /> */}
      </Flex>

      {/* <Grid
        mb="20px"
        templateColumns={{
          base: "1fr",
          lg: "repeat(2, 1fr)",
          "2xl": "1.34fr 1.62fr 1fr",
        }}
        templateRows={{
          base: "1fr",
          lg: "repeat(2, 1fr)",
          "2xl": "1fr",
        }}
        gap={{ base: "20px", xl: "20px" }}
      >
        <Projects
          gridArea="1 / 2 / 2 / 2"
          banner={banner}
          avatar={avatar}
          name="Adela Parkson"
          job="Product Designer"
          posts="17"
          followers="9.7k"
          following="274"
        />
        <General
          gridArea={{ base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3" }}
          minH="365px"
          pe="20px"
        />
        <Notifications
          used={25.6}
          total={50}
          gridArea={{
            base: "3 / 1 / 4 / 2",
            lg: "2 / 1 / 3 / 3",
            "2xl": "1 / 3 / 2 / 4",
          }}
        />
      </Grid> */}

      {/* Tab Pane for Orders and Transactions */}
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em" bg={"white"}>
          <Tab
            _selected={{
              bg: "blue.500",
              color: "white",
              borderColor: "blue.500",
            }}
            _hover={{ bg: "blue.400" }}
            fontWeight="semibold"
          >
            Orders
          </Tab>
          <Tab
            _selected={{
              bg: "blue.500",
              color: "white",
              borderColor: "blue.500",
            }}
            _hover={{ bg: "blue.400" }}
            fontWeight="semibold"
          >
            Transactions
          </Tab>
          <Tab
            _selected={{
              bg: "blue.500",
              color: "white",
              borderColor: "blue.500",
            }}
            _hover={{ bg: "blue.400" }}
            fontWeight="semibold"
          >
            Ledger
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {/* Orders Content */}
            <Flex
              px="25px"
              py={"16px"}
              borderRadius={"16px"}
              justify="space-between"
              mb="20px"
              align="center"
              bg={"white"}
            >
              <Text
                color={textColor}
                fontSize="2rem"
                fontWeight="700"
                lineHeight="100%"
              >
                Orders
              </Text>
              <Button colorScheme="blue" onClick={handleAddTransaction}>
                Add Order
              </Button>
            </Flex>

            <ColumnsTable
              columnsData={columnsDataTransactions}
              tableData={customer.transactions ?? []}
              handleClick={handleViewTransaction}
              handleDelClick={handleDelClick}
            />
          </TabPanel>
          <TabPanel>
            {/* Transactions Content */}
            <Flex
              px="25px"
              py={"16px"}
              borderRadius={"16px"}
              justify="space-between"
              mb="20px"
              align="center"
              bg={"white"}
            >
              <Text
                color={textColor}
                fontSize="2rem"
                fontWeight="700"
                lineHeight="100%"
              >
                Transactions
              </Text>
              <Button colorScheme="blue" onClick={handleAddPayment}>
                Add Transaction
              </Button>
            </Flex>
            <ColumnsTablePayments
              columnsData={columnsDataPayments}
              tableData={customer.payments ?? []}
              handleDelClick={handlePayDelClick}
            />
          </TabPanel>
          <TabPanel>
            {/* Orders Content */}
            <Flex
              px="25px"
              py={"16px"}
              borderRadius={"16px"}
              justify="space-between"
              mb="20px"
              align="center"
              bg={"white"}
            >
              <Text
                color={textColor}
                fontSize="2rem"
                fontWeight="700"
                lineHeight="100%"
              >
                Ledger
              </Text>
              <Button colorScheme="blue" onClick={handlePrint}>
                {isLoading ? (
                  <Spinner
                    thickness="4px"
                    speed="1s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="lg"
                  />
                ):
                'Generate Ledger'}
              </Button>
            </Flex>

            <ColumnsTableLedger
              columnsData={columnsDataLedger}
              tableData={customer.ledger ?? []}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>

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
              Are you sure you want to delete this order #{ordId}?
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

      {/* /pymt  */}

      <AlertDialog
        isOpen={isPyOpen}
        leastDestructiveRef={cancelRef}
        onClose={onPyClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Deletion
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this Transaction #{pyId}?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onPyClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handlePyDeleteConfirmed}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
